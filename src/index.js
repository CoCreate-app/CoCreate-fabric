import { fabric } from 'fabric';
import { queryElements } from '@cocreate/utils'

function init() {
    let elements = document.querySelectorAll('[fabric]');
    initElements(elements);
    initFilters()
}

function initElements(elements) {
    for (let element of elements)
        initElement(element);
}

function initElement(element) {
    const canvas = new fabric.Canvas(element);
    const src = element.getAttribute('src');

    if (src) {
        fabric.Image.fromURL(src, function (img) {
            img.set({ left: 100, top: 100 });
            canvas.add(img);
        });
    }

}

function initFilters() {
    let filters = document.querySelectorAll('[fabric-selector]');
    for (let filter of filters) {
        let canvasElements = queryElements({ filter, prefix: 'fabric' });

        // Add event listeners based on element type
        if (filter.tagName.toLowerCase() === 'input') {
            filter.addEventListener('input', (event) => applyFilter(event, filter, canvasElements));
        } else if (filter.tagName.toLowerCase() === 'select') {
            filter.addEventListener('change', (event) => applyFilter(event, filter, canvasElements));
        }
    }
}

function applyFilter(event, filter, canvasElements) {
    let filterType = filter.getAttribute('fabric-image-filter');
    if (!filterType)
        return

    let filterParam
    if (filterType.includes('.')) {
        filterType = filterType.split('.')
        filterParam = filterType[1].toLowerCase()
        filterType = filterType[0].charAt(0).toUpperCase() + filterType[0].slice(1)
    } else {
        filterType = filterType.charAt(0).toUpperCase() + filterType.slice(1)
        filterParam = filterType.toLowerCase()
    }

    let filterValue = event.target.value;
    if (filter.type === 'range' || filter.type === 'number') {
        filterValue = parseFloat(filterValue);
    }

    for (let canvasElement of canvasElements) {
        let canvas = new fabric.Canvas(canvasElement);
        let activeObject = canvas.getActiveObject();

        if (activeObject && activeObject.type === 'image') {
            activeObject.filters = activeObject.filters || [];
            let filterIndex = activeObject.filters.findIndex(f => f.type === filterType);

            if (filterIndex >= 0) {
                activeObject.filters[filterIndex][filterParam] = filterValue
            } else {
                let filterObj = {};
                filterObj[filterParam] = filterValue;
                let fabricFilter = new fabric.Image.filters[filterType](filterObj);
                activeObject.filters.push(fabricFilter);
            }

            activeObject.applyFilters();
            canvas.renderAll();
        }
    }
}

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

init()