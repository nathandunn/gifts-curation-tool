import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import SearchField from '../../../../src/ui/components/SearchField';

describe('SearchField component', () => {
  test('should render', () => {
    const component = renderer
      .create(<MemoryRouter><SearchField /></MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
