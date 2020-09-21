import { Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';
import { MouseEvent, KeyboardEvent } from 'react';
import * as _ from 'lodash';

export interface RightClickActionOptions {
	handler(MouseEvent):void;
}


export class RightClickAction extends Action {
	constructor(options: RightClickActionOptions) {
		console.log(options)
		super({
			type: InputType.MOUSE_DOWN,
			fire: (event: ActionEvent<MouseEvent>) => {
				// console.log(event.event.type)
				// console.log(event.event.button)
				// console.log(event.event)
				const temp = event.event.nativeEvent.which
				const right_click = 3 //todo
				if(event.event.nativeEvent.which == right_click){
					console.log('right click handler')
					event.event.preventDefault()
					event.event.stopPropagation()
					console.log(event.event.isDefaultPrevented())
					console.log(event.event.isPropagationStopped())
					event.event.nativeEvent.preventDefault()
					event.event.nativeEvent.stopPropagation()
					// console.log(event.event.nativeEvent.isDefaultPrevented())
					// console.log(event.event.nativeEvent.isPropagationStopped())
					options.handler(event)
					// debugger
				}
			}
		});
	}
}
