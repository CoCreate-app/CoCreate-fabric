import { fabric } from 'fabric';

// Create a canvas instance
const canvas = new fabric.Canvas('canvas');

// Load an image
fabric.Image.fromURL('path/to/your/image.jpg', function (img) {
    img.set({
        left: 100,
        top: 100,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
    });
    img.scaleToWidth(300);
    img.scaleToHeight(300);

    // Add image to canvas
    canvas.add(img);

    // Make image selectable
    img.set({
        selectable: true,
        hasControls: true,
        hasBorders: true,
    });

    canvas.setActiveObject(img);
    canvas.renderAll();
});

// Apply various filters
document.getElementById('applyFilters').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        activeObject.filters.push(
            new fabric.Image.filters.Brightness({ brightness: 0.1 }),
            new fabric.Image.filters.Contrast({ contrast: 0.15 }),
            new fabric.Image.filters.Grayscale(),
            new fabric.Image.filters.Sepia(),
            new fabric.Image.filters.Blur({ blur: 0.5 }),
            new fabric.Image.filters.Sharpen({ matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0] }),
            new fabric.Image.filters.Noise({ noise: 100 }),
            new fabric.Image.filters.Pixelate({ blocksize: 8 }),
            new fabric.Image.filters.RemoveColor({ color: '#00ff00', distance: 0.1 }),
            new fabric.Image.filters.BlendColor({ color: '#ff0000', mode: 'multiply' }),
            new fabric.Image.filters.Multiply({ color: '#00ff00' }),
            new fabric.Image.filters.Gamma({ gamma: [1, 0.5, 0.5] }),
            new fabric.Image.filters.Tint({ color: '#ff0000', opacity: 0.5 }),
            new fabric.Image.filters.GradientTransparency({ threshold: 100 }),
            new fabric.Image.filters.Convolute({ matrix: [1, 1, 1, 1, -7, 1, 1, 1, 1] })
        );
        activeObject.applyFilters();
        canvas.renderAll();
    }
});


document.getElementById('clarendon').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        activeObject.filters = [];
        activeObject.filters.push(
            new fabric.Image.filters.Brightness({ brightness: 0.05 }),
            new fabric.Image.filters.Contrast({ contrast: 0.15 }),
            new fabric.Image.filters.Saturation({ saturation: 0.3 }),
            new fabric.Image.filters.Tint({ color: '#b3ccff', opacity: 0.1 })
        );
        activeObject.applyFilters();
        canvas.renderAll();
    }
});

document.getElementById('gingham').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        activeObject.filters = [];
        activeObject.filters.push(
            new fabric.Image.filters.Saturation({ saturation: -0.2 }),
            new fabric.Image.filters.HueRotation({ rotation: -0.1 }),
            new fabric.Image.filters.Brightness({ brightness: 0.05 })
        );
        activeObject.applyFilters();
        canvas.renderAll();
    }
});

document.getElementById('juno').addEventListener('click', function () {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        activeObject.filters = [];
        activeObject.filters.push(
            new fabric.Image.filters.Contrast({ contrast: 0.2 }),
            new fabric.Image.filters.Saturation({ saturation: 0.1 }),
            new fabric.Image.filters.Tint({ color: '#ffd700', opacity: 0.1 })
        );
        activeObject.applyFilters();
        canvas.renderAll();
    }
});
