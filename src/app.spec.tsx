import { configure, HTMLAttributes, shallow, ShallowWrapper  } from 'enzyme';
import * as React from 'react';

import { TestComponent } from './app';

const child: ShallowWrapper<undefined, undefined> = shallow(<TestComponent />);

it('should render without errors', () => {
    expect(child.length).toBe(1);
});

it('should match the snapshot', () => {
    expect(child).toMatchSnapshot();
});
