/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {act, renderHook} from 'react-hooks-testing-library';
import {Item} from '@react-stately/collections';
import React from 'react';
import {useComboBoxState} from '../';

describe('useComboBoxState tests', function () {

  describe('open state', function () {
    let onOpenChange;
    let defaultProps;
    beforeEach(() => {
      onOpenChange = jest.fn();
      defaultProps = {items: [{id: 1, name: 'one'}], children: (props) => <Item>{props.name}</Item>, onOpenChange};
    });
    it('should be closed by default', function () {
      let props = defaultProps;
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.isOpen).toBe(false);

      act(() => result.current.open());
      expect(result.current.isOpen).toBe(true);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      act(() => result.current.close());
      expect(result.current.isOpen).toBe(false);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should be set open by default if defaultOpen is true', function () {
      let props = {...defaultProps, defaultOpen: true};
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.isOpen).toBe(true);

      act(() => result.current.close());
      expect(result.current.isOpen).toBe(false);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('open should be a controllable value', function () {
      let props = {...defaultProps, isOpen: true};
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.isOpen).toBe(true);

      act(() => result.current.close());
      expect(result.current.isOpen).toBe(true);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // TODO fix
      /*
      rerender({...defaultProps, isOpen: false});
      expect(result.current.isOpen).toBe(false);

      act(() => result.current.open());
      expect(result.current.isOpen).toBe(false);
      expect(onOpenChange).toHaveBeenCalledWith(true);*/
    });
  });

  describe('values', function () {
    let onInputChange;
    let defaultProps;
    beforeEach(() => {
      onInputChange = jest.fn();
      defaultProps = {items: [{id: 1, name: 'one'}], children: (props) => <Item>{props.name}</Item>, onInputChange};
    });

    it('can have a default value', function () {
      let props = {...defaultProps, defaultInputValue: 'hello'};
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.value).toBe('hello');
    });

    it('fires an event when the value is changed and updates if uncontrolled', function () {
      let props = {...defaultProps, defaultInputValue: 'hello'};
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.value).toBe('hello');
      expect(onInputChange).not.toHaveBeenCalled();
      result.current.setValue('hellow');
      expect(result.current.value).toBe('hellow');
      expect(onInputChange).toHaveBeenCalledWith('hellow');
    });

    it('starts blank if no (default) value', function () {
      let props = {...defaultProps};
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.value).toBe('');
      expect(onInputChange).not.toHaveBeenCalled();
      result.current.setValue('h');
      expect(result.current.value).toBe('h');
      expect(onInputChange).toHaveBeenCalledWith('h');
    });

    it('can be controlled', function () {
      let props = {...defaultProps, inputValue: 'hello'};
      let {result} = renderHook(() => useComboBoxState(props), {initialProps: props});
      expect(result.current.value).toBe('hello');
      expect(onInputChange).not.toHaveBeenCalled();
      result.current.setValue('hellow');
      expect(result.current.value).toBe('hello');
      expect(onInputChange).toHaveBeenCalledWith('hellow');
    });
  });
});