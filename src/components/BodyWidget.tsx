import * as React from 'react';
import * as _ from 'lodash';
import { 
	DefaultNodeModel, 
	DefaultLinkModel, 
	PortModel, 
	NodeModel,
	LinkModel
 } from '@projectstorm/react-diagrams';
import { BaseModel, CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget';
import { DemoButton, DemoWorkspaceWidget } from '../helpers/DemoWorkspaceWidget';
import styled from '@emotion/styled';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { RightClickAction } from './RightClickAction';

class CanvasDragToggle extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			openDialog: false
		}
		this.handleClose = this.handleClose.bind(this);
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.cloneSelected = this.cloneSelected.bind(this);
		this.deleteSelected = this.deleteSelected.bind(this);

		this.props.engine.getActionEventBus().registerAction(new RightClickAction({ handler: this.handleClickOpen }));
	}
	async handleClickOpen(event) {
		if(this.state.openDialog){
			return
		}
		const element = this.props.engine.getActionEventBus().getModelForEvent(event);
		if (!element) {
			return
		}else {
			console.log(element)
			console.log(event)
			// debugger
			this.props.engine.getModel().setLocked(true);
			this.setState({openDialog: true})
		}
		// initiate dragging a new link
		// else if (element instanceof PortModel) {
		// 	return;
		// }
		
	}
	
	async handleClose() {
		this.setState({openDialog: false})
		this.props.engine.getModel().setLocked(false);
		this.props.engine.getModel().clearSelection();
		// await this.props.engine.repaintCanvas(true);
	}

	cloneSelected() {
		let { engine } = this.props;
		let offset = { x: 100, y: 100 };
		let model = engine.getModel();

		let itemMap = {};
		_.forEach(model.getSelectedEntities(), (item: BaseModel<any>) => {
			let newItem = item.clone(itemMap);

			// offset the nodes slightly
			if (newItem instanceof DefaultNodeModel) {
				newItem.setPosition(newItem.getX() + offset.x, newItem.getY() + offset.y);
				model.addNode(newItem);
			} else if (newItem instanceof DefaultLinkModel) {
				// offset the link points
				newItem.getPoints().forEach((p) => {
					p.setPosition(p.getX() + offset.x, p.getY() + offset.y);
				});
				model.addLink(newItem);
			}
			(newItem as BaseModel).setSelected(false);
		});

		this.forceUpdate();
	}
	deleteSelected() {
		let { engine } = this.props;
		let offset = { x: 100, y: 100 };
		let model = engine.getModel();
		let itemMap = {};
		_.forEach(model.getSelectedEntities(), (item: NodeModel<any>) => {
			item.remove()
		});

		this.forceUpdate();
	}
	render() {
		const { engine } = this.props;
		return (
			<DemoWorkspaceWidget
				buttons={[
					<DemoButton key={1} onClick={this.cloneSelected}>Clone Selected</DemoButton>,
					<DemoButton key={2} onClick={this.deleteSelected}>Delete Selected</DemoButton>
				]}>
				<DemoCanvasWidget>
					<CanvasWidget engine={engine} />
				</DemoCanvasWidget>
				<Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
					<DialogContent>
					<DialogContentText>
						To subscribe to this website, please enter your email address here. We will send updates
						occasionally.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Email Address"
						type="email"
						fullWidth
					/>
					</DialogContent>
					<DialogActions>
					<Button onClick={this.handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={this.handleClose} color="primary">
						Subscribe
					</Button>
					</DialogActions>
				</Dialog>
			</DemoWorkspaceWidget>
		);
	}
}
export interface BodyWidgetProps {
	app: Application;
}

export const Body = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	min-height: 100%;
`;

export const Header = styled.div`
	display: flex;
	background: rgb(30, 30, 30);
	flex-grow: 0;
	flex-shrink: 0;
	color: white;
	font-family: Helvetica, Arial, sans-serif;
	padding: 10px;
	align-items: center;
`;

export const Content = styled.div`
	display: flex;
	flex-grow: 1;
`;

export const Layer = styled.div`
	position: relative;
	flex-grow: 1;
`;

export class BodyWidget extends React.Component<BodyWidgetProps> {
	constructor(props){
		super(props)
	}
	render() {
		return (
			<Body>
				<Header>
					<div className="title">Storm React Diagrams - DnD demo</div>
				</Header>
				<Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)" />
					</TrayWidget>
					<Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

							var node: DefaultNodeModel = node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
							if (data.type === 'in') {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
								node.addInPort('In');
							} else {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addOutPort('Out');
							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app.getDiagramEngine().getModel().addNode(node);
							this.forceUpdate();
						}}
						onDragOver={(event) => {
							event.preventDefault();
						}}>
						{/* <DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget> */}
						<CanvasDragToggle engine={this.props.app.getDiagramEngine()} model={this.props.app.getActiveDiagram()} />;
					</Layer>
				</Content>
			</Body>
		);
	}
}
