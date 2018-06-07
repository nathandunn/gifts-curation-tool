import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Mappings from '../../../src/ui/Mappings';

describe('Mappings component', () => {
  test('should render', () => {
    const component = renderer
      .create(<MemoryRouter>
        <Mappings />
              </MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
