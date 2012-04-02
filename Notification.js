/*
	Copyright (C) 2012 by Dhaya Benmessaoud <dhaya.benmessaoud@gmail.com>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
 */
var Notification = function () {
	var instance, container, shape, image, activity, label, animation;
	var show, hide, setLabel, getDefaults, setDefaults, clickAction;

	var dispatchError = function ( message ) {
		Ti.API.error('Notification/ ' + message);
		return;
	};

	/**
	 * Display a notification on screen
	 * @param	{Object}	parent		The container where the notification will be shown
	 * @param	{String}	label		(optional) The text displayed on the notification
	 * @param	{Boolean}	spinner		(optional) Shows an activityIndicator with the notification
	 * @param	{String}	image		(optional) The url to the image that will be shown with the notification
	 * @param	{Number}	duration	(optional) Seconds before the notification will hide itself
	 * @param	{Function}	onclick		(optional) A method to call when a tap is detected on the notification
	 */
	show = function ( parameters ) {
		if ( typeof(parameters) !== 'object' ) return dispatchError('<parameters> must be a valid Object { parent, label, [spinner|image, duration] }');
		if ( typeof(parameters.parent) !== 'object' ) return dispatchError('<parent> must be a valid container');
		if ( parameters.label && typeof(parameters.label) !== 'string' ) return dispatchError('<label> must be a String');
		else if ( !parameters.label ) parameters.label = getDefaults('label');
		if ( typeof(parameters.spinner) !== 'boolean' ) parameters.spinner = getDefaults('spinner');
		if ( typeof(parameters.image) !== 'string' ) parameters.image = getDefaults('image');
		if ( typeof(parameters.duration) !== 'number' ) parameters.duration = getDefaults('duration');

		if ( !instance ) {
			instance = Ti.UI.createView();

			container = Ti.UI.createView({ width: getDefaults('size'), height: getDefaults('size'), opacity: 0.0, touchEnabled: false });
			instance.add(container);

			shape = Ti.UI.createView({
				width: getDefaults('size'), height: getDefaults('size'),
				backgroundColor: '#333',
				borderRadius: 10,
				opacity: 0.7
			});
			container.add(shape);

			activity = Ti.UI.createActivityIndicator({ style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG, touchEnabled: false });
			container.add(activity);

			image = Ti.UI.createImageView({
				center: { x: getDefaults('size') / 2, y: getDefaults('size') / 2 },
				width: 'auto', height: 'auto',
				preventDefaultImage: true,
				touchEnabled: false
			});
			container.add(image);

			label = Ti.UI.createLabel({
				left: 0, right: 0, bottom: 5,
				height: 'auto',
				color: '#fff',
				font: { fontSize: 11, fontWeight: 'bold' },
				textAlign: 'center',
				shadowColor: '#333',
				shadowOffset: { x: 0, y: 1 }
			});
			container.add(label);

			animation = Ti.UI.createAnimation({
				transform: Ti.UI.create2DMatrix().scale(1),
				opacity: 1.0,
				duration: 300
			});
		}

		label.text = parameters.label;

		if ( parameters.image ) {
			image.image = parameters.image;
			image.visible = true;
		}
		else if ( parameters.spinner === true ) activity.show();

		if ( parameters.duration ) setTimeout(function ( ) {
			hide({ parent: parameters.parent });
		}, parameters.duration * 1000);

		parameters.parent.add(instance);

		container.transform = Ti.UI.create2DMatrix().scale(1.5);
		container.animate(animation);

		if ( clickAction ) {
			instance.removeEventListener('click', clickAction);
			clickAction = null;
		}
		if ( parameters.onclick ) {
			clickAction = parameters.onclick;
			instance.addEventListener('click', clickAction);
		}
	};

	/**
	 * Removes a notification from screen
	 * @param	{Object}	parent		The container from where the notification will be removed
	 */
	hide = function ( parameters ) {
		if ( !instance ) return dispatchError('An error occurred: the notification has not been initialized correctly.');
		if ( typeof(parameters) !== 'object' ) return dispatchError('<parameters> must be a valid Object { parent }');
		if ( typeof(parameters.parent) !== 'object' ) return dispatchError('<parent> must be a valid container');

		container.animate({ opacity: 0.0, duration: 200}, function ( ) {
			image.visible = false; activity.hide();
			parameters.parent.remove(instance);
		});
	};

	/**
	 * Changes the label of a notification
	 * @param	{String}	text		The label which will be passed to the notification
	 */
	setLabel = function ( text ) {
		if ( !instance ) return dispatchError('An error occurred: the notification has not been initialized correctly.');
		label.text = text;
	};

	/**
	 * Retrieves a property related to the notification
	 * @param	{String}	key			The property's name
	 * @return	value
	 */
	getDefaults = function ( key ) {
		if ( !Ti.App.Properties.hasProperty('fr.benmessaoud.notification.defaults') ) {
			setDefaults();
		}

		return JSON.parse(Ti.App.Properties.getString('fr.benmessaoud.notification.defaults'))[key] || null;
	};

	/**
	 * Saves configuration properties used by the notification.
	 * Can be reset when nothing is specified in the parameters
	 */
	setDefaults = function ( parameters ) {
		var defaults;
		if ( parameters && Ti.App.Properties.hasProperty('fr.benmessaoud.notification.defaults')) defaults = JSON.parse(Ti.App.Properties.getString('fr.benmessaoud.notification.defaults'));
		else defaults = { size: 100, label: '', spinner: false, image: null, duration: null };

		if ( typeof(parameters) !== 'object' ) parameters = {};
		if ( parameters.size && typeof(parameters.size) !== 'number' ) return dispatchError('<size> must be a Number');
		else if ( parameters.size ) defaults.size = parameters.size;
		if ( parameters.label && typeof(parameters.label) !== 'string' ) return dispatchError('<label> must be a String');
		else if ( parameters.label ) defaults.label = parameters.label;
		if ( parameters.spinner && typeof(parameters.spinner) !== 'boolean' ) return dispatchError('<spinner> must be a Boolean');
		else if ( parameters.spinner ) defaults.spinner = parameters.spinner;
		if ( parameters.image && typeof(parameters.image) !== 'string' ) return dispatchError('<image> must be a String');
		else if ( parameters.image ) defaults.image = parameters.image;
		if ( parameters.duration && typeof(parameters.duration) !== 'number' ) return dispatchError('<duration> must be a Number');
		else if ( parameters.duration ) defaults.duration = parameters.duration;

		Ti.App.Properties.setString('fr.benmessaoud.notification.defaults', JSON.stringify(defaults));
		instance = null;
	};

	return function () {
		return {
			instance: instance,
			show: show,
			hide: hide,
			setLabel: setLabel,
			getDefaults: getDefaults,
			setDefaults: setDefaults
		};
	}();
}();