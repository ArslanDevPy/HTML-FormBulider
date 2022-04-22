const formControls = [];

const buildElement = ({ tag, text, ...attributes }) => {

    let inputElement = document.createElement(tag);
    Object.keys(attributes).forEach(attributeName => {
        inputElement.setAttribute(attributeName, attributes[attributeName]);
    });

    inputElement.innerHTML = text || '';
    return inputElement;
};

const buildLabel = (id, label) => {
    let labelElement = buildElement({
        tag: 'label',
        class: 'col-sm-3 col-form-label',
        for: id
    });

    labelElement.appendChild(document.createTextNode(label));
    return labelElement;
};

const buildWrapper = (...children) => {

    let wrapper = buildElement({ tag: 'div', class: 'form-group row' });

    if (children) {
        children.forEach(child => wrapper.appendChild(child));
    }
    return wrapper;
};

const buildComponent = ({ label, ...attributes }) => {

    let labelElement = buildLabel(attributes.id, label);
    let inputElement = buildElement(attributes);
    formControls.push({ label, ...attributes });
    return buildWrapper(labelElement, inputElement);
};

const buildButton = (attributes) => {

    let inputElement = buildElement(attributes);
    formControls.push(attributes);
    return inputElement;
};

const buildSelect = ({ label, options, ...attributes }) => {

    let labelElement = buildLabel(attributes.id, label);
    let inputElement = buildElement(attributes);

    Object.keys(options).forEach(optionKey => {
        let optionElment = buildElement({ tag: 'option', value: options[optionKey] });
        optionElment.innerHTML = optionKey;
        inputElement.appendChild(optionElment);
    });

    document.querySelector("div.dropdown-menu").innerHTML = "";
    formControls.push({ label, options, ...attributes });
    return buildWrapper(labelElement, inputElement);
};
// *************   End of Create Element Menthods ************************************


// *************   Event Handlers ************************************
let formBuilder = document.querySelector('#formBuilder');
let formDefinition = document.querySelector('#formDefinition');
let handlers = {
    input: buildComponent,
    textarea: buildComponent,
    button: buildButton,
    select: buildSelect,
};

document.querySelectorAll('button[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {

        const control = {
            id: e.target.dataset.target + "_" + (new Date()).getTime().toString().slice(-7)
        };

        e.target.parentElement.querySelectorAll('[data-field]').forEach(item => {
            control[item.dataset.field] = item.value;
        });

        e.target.parentElement.querySelectorAll("div.dropdown-menu a").forEach(item => {
            control.options = control.options || {};
            control.options[item.dataset.name] = item.dataset.value;
        });

        const element = handlers[e.target.dataset.target](control);
        formBuilder.appendChild(element);
        formDefinition.reset();
    });
});

function saveFormElements() {
    alert(formControls)
    console.log(formControls)
    localStorage.clear();
    localStorage.setItem('controls', JSON.stringify(formControls));
    alert('form element save in local storage. \nyou can see data in console with "controls" key.');
}

function loadFormElements() {
    
    const controls = JSON.parse(localStorage.getItem('controls'));
    formControls.length = 0;
    formBuilder.innerHTML = "";

    controls.forEach(control => {
        const element = handlers[control.tag](control);
        formBuilder.appendChild(element);
    });
}

function addOption() {

    const optName = document.querySelector('input[data-optfield="name"]');
    const optValue = document.querySelector('input[data-optfield="value"]');
    let listItemElment = document.createElement("a");
    listItemElment.setAttribute('data-name', optName.value);
    listItemElment.innerHTML = `${optName.value}: ${optValue.value}`;
    listItemElment.setAttribute('data-value', optValue.value);
    listItemElment.className = "dropdown-item";
    listItemElment.setAttribute("href", "#");
    document.querySelector("div.dropdown-menu").appendChild(listItemElment);
    optName.value = "";
    optValue.value = "";
}
