import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import Category from './Category.component';
import { internal_resolveProps } from '@mui/utils';

test("renders content", () => {

	const component = render(
		<BrowserRouter>
			<Category />
		</BrowserRouter>
	);

	component.getByText('Categoria');
});
