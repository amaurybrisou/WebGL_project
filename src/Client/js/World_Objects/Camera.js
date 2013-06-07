(function () {
    //load Builders

    var f = function () {
        if (typeof window.mmo == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo not Loaded", "Camera");
            return false;
        }
        else if (typeof window.mmo.World_Objects == "undefined") {
            window.Logger.log(window.Level.CRITICAL, "Namespace mmo.World_Objects Altered", "Camera");
            return false;
        }
        return true;
    };

    if (!f()) {
        return;
    }

})(); // CAMERA -----------------------------------------------------------

window.mmo.World_Objects.Camera = function () {
    window.THREE.PerspectiveCamera.call(this,
    window.mmo.VIEW_ANGLE,
    window.mmo.ASPECT,
    window.mmo.NEAR,
    window.mmo.FAR);

    var that = this;

    this.reset = function () {
        that.position.set(
        window.mmo.avatar_obj.position.x,
        window.mmo.avatar_obj.position.y,
        window.mmo.avatar_obj.position.z);



        that.position.x += 0;
        that.position.y += window.mmo.AVATAR_SCALE * window.mmo.CAM_POS_RATIO / 4;
        that.position.z += window.mmo.AVATAR_SCALE * window.mmo.CAM_POS_RATIO;

        that.lookAt(window.mmo.avatar_obj.position);


        window.mmo.avatar_obj.add(window.mmo.camera);

    };

    this.animate = function () {

        that.position.x = window.mmo.avatar_obj.position.x;
        that.position.y = window.mmo.avatar_obj.position.y; + window.mmo.AVATAR_SCALE * window.mmo.CAM_POS_RATIO / 4;
        that.position.z = window.mmo.avatar_obj.position.z; + window.mmo.AVATAR_SCALE * window.mmo.CAM_POS_RATIO;

        that.lookAt(window.mmo.avatar_obj.position);

        //window.mmo.avatar_obj.add(window.mmo.camera);


    };
};


window.mmo.World_Objects.Camera.prototype = Object.create(window.THREE.PerspectiveCamera.prototype);