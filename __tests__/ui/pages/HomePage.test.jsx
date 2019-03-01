import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import HomePage from '../../../src/ui/Home';

describe('HomePage component', () => {
  test('should render', () => {
    const exploreMappingsByOrganism = jest.fn(() => {});
    const props = {
      exploreMappingsByOrganism,
      handleSearchSubmit: () => null,
    };
    const component = renderer
      .create(<MemoryRouter><HomePage {...props} /></MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
