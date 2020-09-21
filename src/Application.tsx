import * as React from 'react';
import * as _ from 'lodash';
import * as SRD from '@projectstorm/react-diagrams';
// import { BaseModel, CanvasWidget } from '@projectstorm/react-canvas-core';
// import { DeleteItemsAction } from '@projectstorm/react-canvas-core';

// import { action } from '@storybook/addon-actions';

export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine = SRD.default();
		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setModel(this.activeModel);

		//3-A) create a default node
		var node1 = new SRD.DefaultNodeModel('Node 1', 'rgb(0,192,255)');
		let port1o1 = node1.addOutPort('dependent');
		let port1o2 = node1.addOutPort('ROS network');
		let port1i1 = node1.addInPort('independent');
		node1.setPosition(100, 100);

		//3-B) create another default node
		var node2 = new SRD.DefaultNodeModel('Node 2', 'rgb(192,255,0)');
		let port2o1 = node2.addOutPort('dependent');
		let port2o2 = node2.addOutPort('ROS network');
		let port2i1 = node2.addInPort('independent');
		node2.setPosition(400, 100);

		// link the ports
		let link1 = port1o1.link(port2i1);

		let models = this.activeModel.addAll(node1, node2, link1);

		/*
		custom event setting
		*/
		const state = this.diagramEngine.getStateMachine().getCurrentState();
		if (state instanceof SRD.DefaultDiagramState) {
			state.dragNewLink.config.allowLooseLinks = false;
		}
		// add a selection listener to each
		// models.forEach((item) => {
		// 	item.registerListener({
		// 		eventDidFire: action('element eventDidFire')
		// 	});
		// });

		// this.activeModel.registerListener({
		// 	eventDidFire: action('model eventDidFire')
		// });
		// this.diagramEngine.getActionEventBus().registerAction(new DeleteItemsAction());
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}