import { fabric } from 'fabric';
import { queryElements } from '@cocreate/utils';
import Actions from '@cocreate/actions';

function init() {
    let elements = document.querySelectorAll('canvas[fabric]');
    initElements(elements);
    initInputs();
}

function initElements(elements) {
    for (let element of elements) {
        initElement(element);
    }
}

function initElement(element) {
    // Reuse the fabric.Canvas instance if it already exists or create a new one
    const canvas = element.fabricInstance || new fabric.Canvas(element);
    element.fabricInstance = canvas; // Store the instance back on the element for future reuse

    const src = element.getAttribute('src');
    if (src) {
        fabric.Image.fromURL(src, function (img) {
            img.set({ left: 100, top: 100 });
            canvas.add(img);
            canvas.renderAll();
        });
    }
}

function initInputs() {
    let inputs = document.querySelectorAll('[fabric-selector], [fabric-closest], [fabric-parent], [fabric-next], [fabric-previous]');
    for (let input of inputs) {
        let canvasElements = queryElements({ element: input, prefix: 'fabric' });
        // Add event listeners based on element type
        if (input.type === 'file') {
            input.addEventListener('change',
                () => insertImage(input, canvasElements));
        } else {
            input.addEventListener(input.tagName.toLowerCase() === 'input' ? 'input' : 'change',
                () => updateCanvas(input, canvasElements));

        }
    }
}

function insertImage(input, canvasElements, file) {
    if (!file) {
        file = input.files[0];
    }
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Ensure there is a canvas element to add the image to
            if (canvasElements.length > 0) {
                const canvas = canvasElements[0].fabricInstance; // Assuming canvas is already initialized and stored

                // Get the size from the parent element of .canvas-container
                const container = canvasElements[0].closest('.canvas-container').parentElement;
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                canvas.setWidth(containerWidth);
                canvas.setHeight(containerHeight);

                fabric.Image.fromURL(e.target.result, function (img) {
                    // Add some padding/margin to ensure the image is smaller than the canvas
                    const padding = 20; // Adjust this value as needed
                    const maxWidth = canvas.width - padding * 2;
                    const maxHeight = canvas.height - padding * 2;

                    var scaleWidth = maxWidth / img.width;
                    var scaleHeight = maxHeight / img.height;
                    var scale = Math.min(1, scaleWidth, scaleHeight); // Ensure the scale is not more than 1

                    // Set the image scale and center it on the canvas
                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        left: (canvas.width - img.width * scale) / 2, // Center horizontally
                        top: (canvas.height - img.height * scale) / 2 // Center vertically
                    });
                    canvas.add(img);
                    canvas.renderAll();

                    // Set the image as the active object
                    canvas.setActiveObject(img);
                });
            }
        };
        reader.readAsDataURL(file); // Read the file as a data URL to use with Fabric.js
    }
}

function updateCanvas(element, canvasElements) {
    if (element && !(element instanceof HTMLCollection) && !(element instanceof NodeList) && !Array.isArray(element))
        element = [element]
    for (let i = 0; i < element.length; i++) {
        if (!canvasElements)
            canvasElements = queryElements({ element: element[i], prefix: 'fabric' });
        // if (!value)
        let value = element[i].value
        let fabricAttr = element[i].getAttribute('fabric');
        if (!fabricAttr)
            return;

        let fabricObject, fabricMethod, fabricProperty, fabricParam
        fabricAttr = fabricAttr.split('.')
        for (let j = 0; j < fabricAttr.length; j++) {
            if (j === 0) {
                fabricObject = fabricAttr[0].charAt(0).toUpperCase() + fabricAttr[0].slice(1)
            } else if (j === 1) {
                if (fabricAttr[1] !== 'filters')
                    fabricMethod = fabricAttr[1].charAt(0).toUpperCase() + fabricAttr[1].slice(1)
                else
                    fabricMethod = fabricAttr[1]
            } else if (j === 2) {
                fabricProperty = fabricAttr[2].charAt(0).toUpperCase() + fabricAttr[2].slice(1)
            } else if (j === 3) {
                fabricParam = fabricAttr[3]
            }
        }

        if (element[i].type === 'range' || element[i].type === 'number') {
            value = parseFloat(value);
        }

        for (let canvasElement of canvasElements) {
            let canvas = canvasElement.fabricInstance; // Use the stored instance
            let activeObject = canvas.getActiveObject();

            if (activeObject) {
                if (fabricMethod === 'filters') {
                    applyFilter(activeObject, fabricProperty, fabricParam, value);
                } else if (fabricProperty) {
                    applyObjectProperty(activeObject, fabricObject, fabricMethod, fabricProperty, value);
                } else {
                    applyMethod(activeObject, fabricObject, fabricMethod);
                }
                canvas.renderAll();
            }
        }
    }
}

function applyFilter(activeObject, fabricProperty, fabricParam, value) {
    activeObject.filters = activeObject.filters || [];
    if (!fabricParam)
        fabricParam = fabricProperty.toLowerCase()

    let filterIndex = activeObject.filters.findIndex(f => f.type === fabricProperty);

    if (filterIndex >= 0) {
        activeObject.filters[filterIndex][fabricParam] = value;
    } else {
        let filterObj = { [fabricParam]: value };
        let fabricFilter = new fabric.Image.filters[fabricProperty](filterObj);
        activeObject.filters.push(fabricFilter);
    }

    activeObject.applyFilters();
}

function applyObjectProperty(activeObject, fabricObject, fabricMethod, fabricProperty, value) {
    // Check method existence and apply properties
    if (activeObject[fabricMethod] && typeof activeObject[fabricMethod] === 'function') {
        activeObject[fabricMethod]({ [fabricProperty]: value });
    } else {
        console.error(`Method '${fabricMethod}' does not exist on '${fabricObject}' or is not a function.`);
    }
}

function applyMethod(activeObject, fabricObject, fabricMethod) {
    if (!activeObject[fabricMethod]) {
        console.error(`Method '${fabricMethod}' does not exist for Fabric.js object.`);
        return;
    }

    activeObject[fabricMethod]();
}

Actions.init({
    name: "fabric",
    endEvent: "fabric",
    callback: (action) => {
        const canvasElements = queryElements({ element: action.form, prefix: 'fabric' });
        const elements = action.form.querySelectorAll('[fabric]')
        updateCanvas(elements, canvasElements);
    }
});

init()