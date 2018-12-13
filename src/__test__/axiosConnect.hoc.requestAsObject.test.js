import React from 'react';
import { shallow } from 'enzyme';
import axiosConnect from '..';
import { axiosMock } from './axiosMock';

const FakeComponent = () => <div>test</div>;
const ConnectedComponent = axiosConnect()(FakeComponent);
const wrapper = shallow(<ConnectedComponent />);

it('should accept request as object', (done) => {
    const responseData = { some: 'json 123' };
    const requestObj = {
        url: '/some/url',
        method: 'put',
        headers: {
            Accept: 'json',
            Authorization: 'Bearer some-oauth2-key'
        }
    };
    axiosMock.onPut(requestObj.url).replyOnce(201, responseData);

    const promise = wrapper.prop('makeRequest')(requestObj);

    expect(wrapper.prop('isLoading')).toBeTruthy();
    promise.then(
        () => {
            const response = wrapper.prop('response');
            expect(response.data).toEqual(responseData);
            expect(response.status).toEqual(201);
            expect(wrapper.prop('isLoading')).toBeFalsy();
            expect(wrapper.prop('error')).toBeNull();
            done();
        }
    );
});
