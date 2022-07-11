import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import Balance from './Balance.component';
import { internal_resolveProps } from '@mui/utils';

test("renders content", () => {

	const component = render(
		<BrowserRouter>
			<Balance />
		</BrowserRouter>
	);

	component.getByText('Fecha');
});
