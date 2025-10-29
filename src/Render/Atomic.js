export class Atomic {
    #element;
    #id;
    #tag;
    #options = {
        attributes: {},
        content: {},
        value: {},
        events: {},
    };

    constructor(tag, options) {
        this.#tag = tag;
        this.#options = { ...this.#options, ...options };
        this.#id = this.#uniqid();
        this.#element = document.createElement(this.#tag);
    }

    static make(tag, options) {
        const atomic = new Atomic(tag, options);
        return atomic;
    }

    attribute(attr, value) {
        this.#options.attributes[attr] = value;
        this.#redraw();
    }

    value(value) {
        this.#options.value = value;
        this.#redraw();
    }

    content(content) {
        this.#options.content = content;
        this.#redraw();
    }

    event(name, callback) {
        this.#options.events[name] = callback;
        this.#redraw();
    }

    render() {
        if (this.#element === HTMLUnknownElement) {
            throw `Unknow HTML element: ${this.#tag}`;
        }
        this.#setAttributes();
        this.#setValue();
        this.#setContent();
        this.#setEvents();

        return this.#element;
    }

    #setAttributes() {
        this.#element.setAttribute('data-id', this.#id);

        if (!('attributes' in this.#options)) {
            return;
        }

        for (const attr in this.#options.attributes) {
            if (this.#options.attributes[attr].length > 0) {
                this.#element.setAttribute(attr, this.#options.attributes[attr]);
            }
        }
    }

    #setValue() {
        if ('value' in this.#options && this.#options.value.length > 0) {
            this.#element.value = this.#options.value;
        }
    }

    #setContent() {
        if ('content' in this.#options && this.#options.content.length > 0) {
            this.#element.innerHTML = this.#options.content;
        }
    }

    #setEvents() {
        if (!('events' in this.#options)) {
            return;
        }

        for (const event in this.#options.events) {
            if (event.length === 0) {
                throw `The event name param of ${this.#tag} is empty`;
            }

            const callback = this.#options.events[event];

            if (typeof callback !== 'function') {
                throw `The callback param of ${this.#tag} is not a function`;
            }

            this.#element.addEventListener(event, function (ev) {
                callback(ev);
            });
        }
    }

    #redraw() {
        const currentElement = document.querySelector(`[data-id="${this.#id}"]`);
        this.#element = document.createElement(this.#tag);
        const newElement = this.render();

        if (currentElement) {
            currentElement.replaceWith(newElement);
        }
    }

    #uniqid() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}
