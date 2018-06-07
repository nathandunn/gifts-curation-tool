import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import SearchComponent from '../../../../src/ui/components/SearchComponent';

describe('SearchComponent component', () => {
  test('should render', () => {
    const component = renderer
      .create(<MemoryRouter>
        <SearchComponent />
              </MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
