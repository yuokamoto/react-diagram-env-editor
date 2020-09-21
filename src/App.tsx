import * as React from 'react';
import * as _ from 'lodash';

import * as SRD from '@projectstorm/react-diagrams';
import { BodyWidget } from './components/BodyWidget';
import { Application } from './Application';

import "./App.css";

export default () => {
	var app = new Application();
	return <BodyWidget app={app} />;
};