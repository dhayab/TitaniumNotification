__Notification__ is a script for [Appcelerator Titanium Mobile](http://www.appcelerator.com/products/titanium-mobile-application-development/). It allows you to display a modal, visual, notification on screen for multiple purposes.

![Using an image](http://f.cl.ly/items/2b3O3W353m0k1q1v1O1T/Capture%20d%E2%80%99%C3%A9cran%20du%20Simulateur%20iOS%202%20avr.%202012%2008.37.22.png) ![A spinner with a label](http://f.cl.ly/items/2y3d1i3U110H403H0T2w/Capture%20d%E2%80%99%C3%A9cran%20du%20Simulateur%20iOS%202%20avr.%202012%2008.38.34.png)

## Usage
Include Notification.js in your document
```javascript
Ti.include('path/to/Notification.js');
```

To use Notification just call this method
```javascript
Notification.show(...);
```

__Notification.show(...)__ needs a parameters dictionary with the following values.  
__parent__: The container where the notification will be shown  
__label__ (optional): The text displayed on the notification  
__spinner__ (optional): Shows an ActivityIndicator with the notification  
__image__ (optional): The url to the image that will be shown with the notification  
__duration__ (optional): Seconds before the notification will hide itself  
__onclick__ (optional): A method to call when a tap is detected on the notification  


## Example
```javascript
Notification.show({
  parent: win,
  label: 'Loading...',
  spinner: true,
  onclick: function ( ) {
    alert('Loading canceled!');
  }
});
```

## Other methods
__Notification.hide(...)__  removes a notification from the screen.  
```javascript
Notification.hide({
  parent: win
});
```  
__Notification.setLabel('Some text')__ changes the label of a notification.  
__Notification.setDefaults(...)__ sets default values to be used for all notifications. They are saved in NSDefaults, and can be overrided when specifying other values in __Notification.show(...)__. You can reset the configuration by calling this method without any parameter.
```javascript
Notification.setDefaults({
  size: 150,
  label: L('Please wait...'),
  spinner: true
});
```