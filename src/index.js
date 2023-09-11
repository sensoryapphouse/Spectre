/*
 4 buttons
 
 background colour

*/
var hideGUI = true;

var splash;
var button;
var button1;
var button2;
var button3;
var crosshairs;
var bdy;

var huecount = 0;
var hueSet = 0;
var view = 0;

function Action(i) {
    console.log(i);
    switch (i) {
        case 1:   
        switch (settings.speed) {
            case .2:
                settings.speed = 1;
                break;
            case .4:
                settings.speed = .2;
                break;
            case .6:
                settings.speed = .4;
                break;
            case 1:
                settings.speed = .6;
        }
        PlaySound(1);
        break;
        case 2: // curlsize: .005, 
        switch (settings.curlSize) {
            case 0.005:
                settings.curlSize = 0.01;
                break;
            case 0.01:
                settings.curlSize = 0.02;
                break;
            case 0.02:
                settings.curlSize = 0.03;
                break;
            case 0.03:
                settings.curlSize = 0.04;
                break;
            case 0.04:
                settings.curlSize = 0.05;
                break;
            case 0.05:
                settings.curlSize = 0.005;
                break;
        }
        PlaySound(2);
        break;
        case 3: // 
        //shadow: .3, .5, .7 1
            switch (settings.shadowDarkness) {
                case 0.8:
                    settings.shadowDarkness = 1.5;
                    break;
                    case 1.5:
                        settings.shadowDarkness = .3;
                    break;
                    case 1.5:
                        settings.shadowDarkness = .3;
                    break;
                    case .3:
                        settings.shadowDarkness = .8;
                    break;
            }
            PlaySound(3);
            break;
        case 4: //   hue shift/colours
        // color1: ffffff, ff0000, ffff00, ff00ff
        // color2: ff0000, ffffff, 0000ff, 0000ff 
            huecount++;
            if (huecount > 7) {
                huecount = -1;
                settings.color1 = '#ffffff';
                settings.color2 = '#ffffff';
            } 
            if (huecount == 0) {
                hueSet++;
                if (hueSet > 3)
                    hueSet = 0;
                switch (hueSet) {
                    case 0:
                        settings.color1 = '#ffffff';
                        settings.color2 = '#ff0000';
                        break;
                    case 1:
                        settings.color2 = '#ffffff';
                        settings.color1 = '#ff0000';
                        break;
                    case 2:
                        settings.color2 = '#ffff00';
                        settings.color1 = '#0000ff';
                        break;
                    case 3:
                        settings.color2 = '#ff00ff';
                        settings.color1 = '#00ff00';
                        break;
                }
            }
            bdy.style.filter = "hue-rotate(" + (huecount * 45) + "deg)";
            settings.bgColor  = "rgb(" + (Math.floor(Math.random() * 64)) + "," +   (Math.floor(Math.random() * 64)) + "," + (Math.floor(Math.random() * 64))+ ")";
            _bgColor = new THREE.Color(settings.bgColor);
            _renderer.setClearColor(settings.bgColor);
            PlaySound(4);
            break;
        case 7: // toggle buttons
            toggleButtons();
            break;
    }
}

function startApp () {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
    splash = document.querySelector('splash');
    splash.onmousedown = function (e) {
        e.stopPropagation();
        splash.hidden = true;
        settings.bloom=true;
    }
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    bdy = document.getElementById('body');
    button.onmousedown = function (e) {
        e.stopPropagation();
        Action(1);
    }
    button1.onmousedown = function (e) {
        e.stopPropagation();
        Action(2);
    }
    button2.onmousedown = function (e) {
        e.stopPropagation();
        Action(3);
    }
    button3.onmousedown = function (e) {
        e.stopPropagation();
        Action(4);
    }

    crosshairs = document.querySelector('crosshairs');
    crosshairs.hidden = true;
    settings.followMouse = false;
}

window.onkeypress = function (e) {
    if (!splash.hidden){
        splash.hidden = true;
        return;
    }

    if (e.repeat)
        return;
    switch (e.keyCode) {
        case 32:
        case 49:
            Action(1);
            break;
        case 50:
            Action(2);
            break;
        case 51:
        case 13:
            Action(3);
            break;
        case 52:
            Action(4);
            break;
        case 53:
            toggleButtons();
            break;
    }
}

function toggleButtons() {
    button.hidden = !button.hidden;
    button1.hidden = !button1.hidden;
    button2.hidden = !button2.hidden;
    button3.hidden = !button3.hidden;
}

var player;
var player1;
var player2;
var player3;

function PlaySound(i) {
    try {
        switch (i) {
            case 1:
                if (player == undefined) {
                    player = document.getElementById('audio');
                    player.loop = false;
                }
                player.load();
                player.play();
                break;
            case 2:
                if (player1 == undefined) {
                    player1 = document.getElementById('audio1');
                }
                player1.load();
                player1.play();
                break;
            case 3:
                if (player2 == undefined) {
                    player2 = document.getElementById('audio2');
                }
                player2.load();
                player2.play();
                break;
            case 4:
                if (player3 == undefined) {
                    player3 = document.getElementById('audio3');
                }
                player3.load();
                player3.play();
                break;
        }
    } catch (e) {};
}
var dat = require('dat-gui');
var Stats = require('stats.js');
var css = require('dom-css');
var raf = require('raf');

var THREE = require('three');

var OrbitControls = require('./controls/OrbitControls');
var settings = require('./core/settings');

var math = require('./utils/math');
var ease = require('./utils/ease');
var mobile = require('./fallback/mobile');
var encode = require('mout/queryString/encode');

var postprocessing = require('./3d/postprocessing/postprocessing');
var motionBlur = require('./3d/postprocessing/motionBlur/motionBlur');
var fxaa = require('./3d/postprocessing/fxaa/fxaa');
var bloom = require('./3d/postprocessing/bloom/bloom');
var fboHelper = require('./3d/fboHelper');
var simulator = require('./3d/simulator');
var particles = require('./3d/particles');
var lights = require('./3d/lights');
var floor = require('./3d/floor');


var undef;
var _gui;
var _stats;

var _width = 0;
var _height = 0;

var _control;
var _camera;
var _scene;
var _renderer;

var _time = 0;
var _ray = new THREE.Ray();

var _initAnimation = 0;

var _bgColor;
var _logo;
var _instruction;
var _footerItems;

function init() {
    startApp();
    if(settings.useStats) {
        _stats = new Stats();
        css(_stats.domElement, {
            position : 'absolute',
            left : '100px',
            top : '100px',
            zIndex : 2048
        });

        document.body.appendChild( _stats.domElement );
    }

    _bgColor = new THREE.Color(settings.bgColor);
    settings.mouse = new THREE.Vector2(0,0);
    settings.mouse3d = _ray.origin;

    _renderer = new THREE.WebGLRenderer({
        // transparent : true,
        // premultipliedAlpha : false,
        antialias : true
    });
    _renderer.setClearColor(settings.bgColor);
    _renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    _renderer.shadowMap.enabled = true;
    document.body.appendChild(_renderer.domElement);

    _scene = new THREE.Scene();
    _scene.fog = new THREE.FogExp2( settings.bgColor, 0.001 );

    _camera = new THREE.PerspectiveCamera( 45, 1, 10, 3000);
    _camera.position.set(300, 60, 300).normalize().multiplyScalar(1000);
    settings.camera = _camera;
    settings.cameraPosition = _camera.position;

    fboHelper.init(_renderer);
    postprocessing.init(_renderer, _scene, _camera);

    simulator.init(_renderer);
    particles.init(_renderer);
    _scene.add(particles.container);

    lights.init(_renderer);
    _scene.add(lights.mesh);

    floor.init(_renderer);
    floor.mesh.position.y = -100;
    _scene.add(floor.mesh);

    _control = new OrbitControls( _camera, _renderer.domElement );
    _control.target.y = 50;
    _control.maxDistance = 1000;
    _control.minPolarAngle = 0.3;
    _control.maxPolarAngle = Math.PI / 2 - 0.1;
    _control.noPan = true;
    _control.noRotate = true; // PB
    _control.update();
    
    _gui = new dat.GUI();
    _gui.close();
    if (hideGUI)
    _gui.domElement.hidden = true;
    if(settings.isMobile) {
        _gui.close();
        _control.enabled = false;
    }

    var simulatorGui = _gui.addFolder('Simulator');
    simulatorGui.add(settings.query, 'amount', settings.amountList).onChange(function(){
        if (confirm('It will restart the demo')) {
            window.location.href = window.location.href.split('#')[0] + encode(settings.query).replace('?', '#');
            window.location.reload();
        }
    });
    simulatorGui.add(settings, 'speed', 0, 3).listen();
    simulatorGui.add(settings, 'dieSpeed', 0.0005, 0.05).listen();
    simulatorGui.add(settings, 'radius', 0.2, 3);
    simulatorGui.add(settings, 'curlSize', 0.001, 0.05).listen();
    simulatorGui.add(settings, 'attraction', -2, 2);
    simulatorGui.add(settings, 'followMouse').name('follow mouse');
    simulatorGui.open();

    var renderingGui = _gui.addFolder('Rendering');
    renderingGui.add(settings, 'shadowDarkness', 0, 1).name('shadow');
    renderingGui.add(settings, 'useTriangleParticles').name('new particle');
    renderingGui.addColor(settings, 'color1').name('base Color');
    renderingGui.addColor(settings, 'color2').name('fade Color');
    renderingGui.addColor(settings, 'bgColor').name('background Color');
    renderingGui.open();


    var postprocessingGui = _gui.addFolder('Post-Processing');
    postprocessingGui.add(settings, 'fxaa').listen();
    motionBlur.maxDistance = 120;
    motionBlur.motionMultiplier = 7 ;
    motionBlur.linesRenderTargetScale = settings.motionBlurQualityMap[settings.query.motionBlurQuality];
    var motionBlurControl = postprocessingGui.add(settings, 'motionBlur');
    var motionMaxDistance = postprocessingGui.add(motionBlur, 'maxDistance', 1, 300).name('motion distance').listen();
    var motionMultiplier = postprocessingGui.add(motionBlur, 'motionMultiplier', 0.1, 15).name('motion multiplier').listen();
    var motionQuality = postprocessingGui.add(settings.query, 'motionBlurQuality', settings.motionBlurQualityList).name('motion quality').onChange(function(val){
        motionBlur.linesRenderTargetScale = settings.motionBlurQualityMap[val];
        motionBlur.resize();
    });
    var controlList = [motionMaxDistance, motionMultiplier, motionQuality];
    motionBlurControl.onChange(enableGuiControl.bind(this, controlList));
    enableGuiControl(controlList, settings.motionBlur);

    var bloomControl = postprocessingGui.add(settings, 'bloom');
    var bloomRadiusControl = postprocessingGui.add(bloom, 'blurRadius', 0, 3).name('bloom radius');
    var bloomAmountControl = postprocessingGui.add(bloom, 'amount', 0, 3).name('bloom amount');
    controlList = [bloomRadiusControl, bloomAmountControl];
    bloomControl.onChange(enableGuiControl.bind(this, controlList));
    enableGuiControl(controlList, settings.bloom);
    postprocessingGui.open();

    function enableGuiControl(controls, flag) {
        controls = controls.length ? controls : [controls];
        var control;
        for(var i = 0, len = controls.length; i < len; i++) {
            control = controls[i];
            control.__li.style.pointerEvents = flag ? 'auto' : 'none';
            control.domElement.parentNode.style.opacity = flag ? 1 : 0.1;
        }
    }

    var preventDefault = function(evt){evt.preventDefault();this.blur();};
    Array.prototype.forEach.call(_gui.domElement.querySelectorAll('input[type="checkbox"],select'), function(elem){
        elem.onkeyup = elem.onkeydown = preventDefault;
        elem.style.color = '#000';
    });

    // _logo = document.querySelector('.logo');
    // _instruction = document.querySelector('.instruction');
    // document.querySelector('.footer').style.display = 'block';
    // _footerItems = document.querySelectorAll('.footer span');

    window.addEventListener('resize', _onResize);
    window.addEventListener('mousemove', _onMove);
    window.addEventListener('touchmove', _bindTouch(_onMove));
    window.addEventListener('keyup', _onKeyUp);

    _time = Date.now();
    _onResize();
    _loop();

}

function _onKeyUp(evt) {
    // if(evt.keyCode === 32) { // PB:
    //     settings.speed = settings.speed === 0 ? 1 : 0;
    //     settings.dieSpeed = settings.dieSpeed === 0 ? 0.015 : 0;
    // }
}

function _bindTouch(func) {
    return function (evt) {
        if(settings.isMobile && evt.preventDefault) {
            evt.preventDefault();
        }
        func(evt.changedTouches[0]);
    };
}


var tmr; // PB
function msTimer() {
    settings.followMouse = true;
    try {
        clearTimeout(tmr);
    } catch (e) {};
    tmr = setTimeout(function () {
        settings.followMouse = false;
    }, 1000);
}

function _onMove(evt) {
    settings.mouse.x = (evt.pageX / _width) * 2 - 1;
    settings.mouse.y = -(evt.pageY / _height) * 2 + 1;
    msTimer();
}

function _onResize() {
    _width = window.innerWidth;
    _height = window.innerHeight;

    postprocessing.resize(_width, _height);

}

function _loop() {
    var newTime = Date.now();
    raf(_loop);
    if(settings.useStats) _stats.begin();
    _render(newTime - _time, newTime);
    if(settings.useStats) _stats.end();
    _time = newTime;
}


function _render(dt, newTime) {

    motionBlur.skipMatrixUpdate = !(settings.dieSpeed || settings.speed) && settings.motionBlurPause;

    var ratio;
    _bgColor.setStyle(settings.bgColor);
    var tmpColor = floor.mesh.material.color;
    tmpColor.lerp(_bgColor, 0.05);
    _scene.fog.color.copy(tmpColor);
    _renderer.setClearColor(tmpColor.getHex());

    _initAnimation = Math.min(_initAnimation + dt * 0.00025, 1);
    simulator.initAnimation = _initAnimation;

    _control.maxDistance = _initAnimation === 1 ? 1000 : math.lerp(1000, 450, ease.easeOutCubic(_initAnimation));
    _control.update();
    lights.update(dt, _camera);

    // update mouse3d
   _camera.updateMatrixWorld();
    _ray.origin.setFromMatrixPosition( _camera.matrixWorld );
    _ray.direction.set( settings.mouse.x, settings.mouse.y, 0.5 ).unproject( _camera ).sub( _ray.origin ).normalize();
    var distance = _ray.origin.length() / Math.cos(Math.PI - _ray.direction.angleTo(_ray.origin));
    _ray.origin.add( _ray.direction.multiplyScalar(distance * 1.0));
    simulator.update(dt);
    particles.update(dt);

    ratio = Math.min((1 - Math.abs(_initAnimation - 0.5) * 2) * 1.2, 1);
    var blur = (1 - ratio) * 10;
    // _logo.style.display = ratio ? 'block' : 'none';
    // if(ratio) {
    //     _logo.style.opacity = ratio;
    //     _logo.style.webkitFilter = 'blur(' + blur + 'px)';
    //     ratio = (0.8 + Math.pow(_initAnimation, 1.5) * 0.5);
    //     if(_width < 580) ratio *= 0.5;
    //     _logo.style.transform = 'scale3d(' + ratio + ',' + ratio + ',1)';
    // }

    // for(var i = 0, len = _footerItems.length; i < len; i++) {
    //     ratio = math.unLerp(0.5 + i * 0.01, 0.6 + i * 0.01, _initAnimation);
    //     _footerItems[i].style.transform = 'translate3d(0,' + ((1 - Math.pow(ratio, 3)) * 50) + 'px,0)';
    // }

    ratio = math.unLerp(0.5, 0.6, _initAnimation);
    // if(!settings.isMobile) {
    //     _instruction.style.display = ratio ? 'block' : 'none';
    //     _instruction.style.transform = 'translate3d(0,' + ((1 - ratio * ratio) * 50) + 'px,0)';
    // }

    fxaa.enabled = !!settings.fxaa;
    motionBlur.enabled = !!settings.motionBlur;
    bloom.enabled = !!settings.bloom;

    // _renderer.render(_scene, _camera);
    postprocessing.render(dt, newTime);

}

mobile.pass(init);


var gpad;
var gstate = [false,false,false,false];
var tmr;

function gamepadHandler(event, connecting) {
   gpad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]
  if (connecting) {
    setInterval(function () {
        try {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            gpad = gamepads[0];
            if (!splash.hidden && (gpad.buttons[0].pressed || gpad.buttons[1].pressed || gpad.buttons[2].pressed || gpad.buttons[3].pressed)) {
                splash.hidden = true;
            } 
            else {
                if (gstate[0] == false && gpad.buttons[0].pressed)
                        Action(1);
                if (gstate[1] == false && gpad.buttons[1].pressed)
                        Action(2);
                if (gstate[2] == false && gpad.buttons[2].pressed)
                    Action(3);
                if (gstate[3] == false && gpad.buttons[3].pressed)
                    Action(4);
                gstate[0] = gpad.buttons[0].pressed;
                gstate[1] = gpad.buttons[1].pressed;
                gstate[2] = gpad.buttons[2].pressed;
                gstate[3] = gpad.buttons[3].pressed;
                console.log(gstate[0],gstate[1],gstate[2],gstate[3]);
            }
        }
        catch (e) {};
        },50);
    } else {
      clearInterval(tmr);
    delete gamepads[gamepad.index];
  }
}

window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);

