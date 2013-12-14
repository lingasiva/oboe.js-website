function ThingView(subject, demoView) {
    this.subject = subject;
    this.demoView = demoView;
}

ThingView.prototype.initDomFromTemplate = function(containerName, templateName, className) {
    this.jDom = stampFromTemplate($('#' + templateName), className);

    var jContainer = this.demoView.jDom.find('.' + containerName);

    if( jContainer.length != 1 ) {
        throw new Error('no one place to put the thing');
    }
    jContainer.append(this.jDom);
    return this.jDom;
};

ThingView.prototype.moveTo = function(where) {
    this.jDom.css({
        translateX: where.x
        ,   translateY: where.y
    });

    return this; // chaining
};

ThingView.prototype.goToXy = function( xProperty, yProperty, xy ) {
    var cssObject = {};

    cssObject[xProperty] = xy.x;
    cssObject[yProperty] = xy.y;

    this.jDom.css(cssObject);
};

ThingView.prototype.animateXy = function( xProperty, yProperty, xyFrom, xyTo, duration ) {

    this.goToXy(xProperty, yProperty, xyFrom);

    var toCssObject = {};
    toCssObject[xProperty]   = xyTo.x;
    toCssObject[yProperty]   = xyTo.y;

    this.jDom.animate(toCssObject, {duration:duration, queue:false});
};

