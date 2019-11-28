//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
const ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uProjectionMatId: -1,
    uModelViewMatId: -1,
    uModelTransformMatId: -1
};

// defines all the render settings
const renderSettings = {
    mode: "perspective",
    settings: {
        ortho: {
            aspect: 4/3,
            scale: 1,
            near: 0.1,
            far: 100
        },
        frustum: {
            fovy: 20, // in degrees
            aspect: 4/3,
            near: 1,
            far: 100
        },
        perspective: {
            fovy: 20, // in degrees
            aspect: 4/3,
            near: 1,
            far: 100
        }
    },
    camera: {
        position: vec3.fromValues(-5, 0, 0),
        lookAt: vec3.fromValues(0, 0, 0),
        rotation: vec3.fromValues(0, 0, 1)
    }
};

var lastFrameTimestamp = 0;
var frameCount = -1; // Limits the frames drawn

// we keep all the parameters for drawing a specific object together
var objects = { };

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    let canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    drawAnimated(0);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpScene();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);

    gl.frontFace(gl.CCW); // defines how the front face is drawn
    gl.cullFace(gl.BACK); // defines which face should be culled
    gl.enable(gl.CULL_FACE); // enables culling
    gl.enable(gl.DEPTH_TEST) // Z-Buffer
}

/**
 * Generate the projection matrix depending on the selected mode
 * @param mode Selected rendering mode. One of ortho, frustum or perspective.
 * @returns {mat4} Projection matrix
 */
function generateProjectionMatrix(mode) {
    let mat = mat4.create();

    let settings = renderSettings.settings[mode];
    switch (mode) {
        case "ortho":
            mat4.ortho(mat, -settings.aspect*settings.scale, settings.aspect*settings.scale, -settings.scale,
                settings.scale, settings.near, settings.far);
            break;
        case "frustum":
            let scale = Math.tan((settings.fovy/2)*(Math.PI/180))*settings.near;
            mat4.frustum(mat, -settings.aspect*scale, settings.aspect*scale,
                -scale, scale, settings.near, settings.far);
            break;
        case "perspective":
            mat4.perspective(mat, (Math.PI / 180.0)*settings.fovy, settings.aspect, settings.near, settings.far);
            break;
        default:
            console.error("Not a valid render mode!");
    }

    return mat;
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.uModelViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelTransformMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelTransformMat");

    // Model View aka. Camera Matrix
    let modelViewMat = mat4.create();
    mat4.lookAt(modelViewMat, renderSettings.camera.position, renderSettings.camera.lookAt,
        renderSettings.camera.rotation);
    gl.uniformMatrix4fv(ctx.uModelViewMatId, false, modelViewMat);

    // Projection Matrix
    let projectionMat = generateProjectionMatrix(renderSettings.mode);
    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMat);
}

/**
 * Setup scene.
 */
function setUpScene(){
    objects.cube = {
        model: new Cube(gl),
        transform: mat4.create()
    };
}

/**
 * Draw the scene.
 */
function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //Tiefenbuffer löschen

    for (const [name, obj] of Object.entries(objects)) {
        console.log("Drawing", name);

        obj.model.draw(gl, ctx, obj.transform);
    }
}

function drawAnimated(timeStamp) {
    // calculate time since last call
    let elapsedTime = 0;
    if (lastFrameTimestamp !== 0) {
        elapsedTime = (timeStamp - lastFrameTimestamp) / 1000.0;
    }
    lastFrameTimestamp = timeStamp;

    // move or change objects
    let cubeTransform = objects.cube.transform;
    let rotationSpeed = 180*elapsedTime;
    if (isDown(key.LEFT)) {
        mat4.rotateX(cubeTransform, cubeTransform, rotationSpeed*(Math.PI/180.0));
    }
    if (isDown(key.DOWN)) {
        mat4.rotateY(cubeTransform, cubeTransform, rotationSpeed*(Math.PI/180.0));
    }
    if (isDown(key.RIGHT)) {
        mat4.rotateZ(cubeTransform, cubeTransform, rotationSpeed*(Math.PI/180.0));
    }
    objects.cube.transform = cubeTransform;

    draw();

    // request the next frame
    if (frameCount < 0 || frameCount > 0) {
        window.requestAnimationFrame(drawAnimated);
        if (frameCount > 0) {
            frameCount--;
        }
    }
}

// Key Handling
const key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
