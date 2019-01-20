/*
* Shards Vue v1.0.7 (https://designrevision.com/downloads/shards-vue/)
* Based on: Bootstrap ^4.1.3 (https://getbootstrap.com)
* Based on: Shards ^2.1.0 (https://designrevision.com/downloads/shards/)
* Copyright 2017-2019 DesignRevision (https://designrevision.com)
* Copyright 2017-2019 Catalin Vasile (http://catalin.me)
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vuejs-datepicker'), require('vue-clickaway'), require('nouislider')) :
    typeof define === 'function' && define.amd ? define(['vuejs-datepicker', 'vue-clickaway', 'nouislider'], factory) :
    (global['shards-Vue'] = factory(global.VueDatepicker,global.vueClickaway,global.noUiSlider));
}(this, (function (VueDatepicker,vueClickaway,noUiSlider) { 'use strict';

    VueDatepicker = VueDatepicker && VueDatepicker.hasOwnProperty('default') ? VueDatepicker['default'] : VueDatepicker;
    noUiSlider = noUiSlider && noUiSlider.hasOwnProperty('default') ? noUiSlider['default'] : noUiSlider;

    /*--------------------------------------------------------------------------
    /* UTILITY FUNCTIONS
    /*--------------------------------------------------------------------------*/

    // Install a Vue plugin if Vue is available on the window object.
    function vueUse(VuePlugin) {
        if (typeof window !== 'undefined' && window.Vue) {
            window.Vue.use(VuePlugin);
        }
    }

    // Register a component plugin.
    function registerComponent(Vue, name, definition) {
        Vue._shards_vue_components_ = Vue._shards_vue_components_ || {};
        var loaded = Vue._shards_vue_components_[name];

        if (!loaded && definition && name) {
            Vue._shards_vue_components_[name] = true;
            Vue.component(name, definition);
        }

        return loaded
    }

    // Register a group of components.
    function registerComponents(Vue, components) {
        for (var component in components) {
            registerComponent(Vue, component, components[component]);
        }
    }

    // Register a directive as being loaded. returns true if directive plugin already registered
    function registerDirective(Vue, name, definition) {
        Vue._shards_vue_directives_ = Vue._shards_vue_directives_ || {};
        var loaded = Vue._shards_vue_directives_[name];

        if (!loaded && definition && name) {
            Vue._shards_vue_directives_[name] = true;
            Vue.directive(name, definition);
        }

        return loaded
    }

    // Register a group of directives as being loaded.
    function registerDirectives(Vue, directives) {
        for (var directive in directives) {
            registerDirective(Vue, directive, directives[directive]);
        }
    }

    // Array check
    if (!Array.isArray) {
        Array.isArray = function (arg) { return Object.prototype.toString.call(arg) === '[object Array]'; };
    }
    var isArray = Array.isArray;

    // Element.matches polyfill
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
    if (typeof Element !== 'undefined' && !Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                // eslint-disable-next-line
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Converts a value to an array.
    function convertToArray(value) {
        if (typeof value === 'string') {
            value = value.split(' ');
        }
        return value
    }

    // Mocks SVGAnimatedString
    var SVGAnimatedString = function () {};
    if (typeof window !== 'undefined') {
        SVGAnimatedString = window.SVGAnimatedString;
    }

    // Generates a GUID
    var guid = function () {
        var lut = [];

        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }

        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;

        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    };


    /*--------------------------------------------------------------------------
    /* DOM UTILITY FUNCTIONS
    /*--------------------------------------------------------------------------*/

    // Get an element by id
    var getById = function (id) {
        return document.getElementById(/^#/.test(id) ? id.slice(1) : id) || null
    };

    // Checks whether a variable is a DOM element, or not.
    var isElement = function (el) {
        return el && el.nodeType === Node.ELEMENT_NODE
    };

    // Checks whether an element has a particular class name, or not.
    var hasClass = function (el, className) {
        if (className && isElement(el)) {
            return el.classList.contains(className)
        }

        return false
    };

    // Adds a class to an element
    var addClass = function (el, className) {
        if (className && isElement(el)) {
            el.classList.add(className);
        }
    };

    // Removes a class from an element
    var removeClass = function (el, className) {
        if (className && isElement(el)) {
            el.classList.remove(className);
        }
    };

    // Removes multiple classes
    function removeClasses(el, classes) {
        var newClasses = convertToArray(classes);
        var classList;

        if (el.className instanceof SVGAnimatedString) {
            classList = convertToArray(el.className.baseVal);
        } else {
            classList = convertToArray(el.className);
        }

        newClasses.forEach(function (newClass) {
            var index = classList.indexOf(newClass);
            if (index !== -1) {
                classList.splice(index, 1);
            }
        });

        if (el instanceof SVGElement) {
            el.setAttribute('class', classList.join(' '));
        } else {
            el.className = classList.join(' ');
        }
    }

    // Sets an attribute on an element
    var setAttr = function (el, attr, value) {
        if (attr && isElement(el)) {
            el.setAttribute(attr, value);
        }
    };

    // Removes an attribute from an element
    var removeAttr = function (el, attr) {
        if (attr && isElement(el)) {
            el.removeAttribute(attr);
        }
    };

    // Gets an attribute value from an element
    var getAttr = function (el, attr) {
        if (attr && isElement(el)) {
            return el.getAttribute(attr)
        }

        return null
    };

    // Checks whether an element is disabled, or not.
    var isDisabled = function (el) {
        return !isElement(el)
            || el.disabled
            || el.classList.contains('disabled')
            || Boolean(el.getAttribute('disabled'))
    };

    // Determines if an HTML element is visible - Faster than CSS check
    var isVisible = function (el) {
        return isElement(el)
            && document.body.contains(el)
            && el.getBoundingClientRect().height > 0
            && el.getBoundingClientRect().width > 0
    };

    // Selects an element.
    var selectElement = function (selector, root) {
        if (!isElement(root)) {
            root = document;
        }

        return root.querySelector(selector) || null
    };

    // Finds closest element matching selector.
    var closest = function (selector, root) {
        if (!isElement(root)) {
            return null
        }

        var Closest = Element.prototype.closest ||
            function (sel) {
                var element = this;
                if (!document.documentElement.contains(element)) {
                    return null
                }

                do {
                    if (element.matches(sel)) {
                        return element
                    }

                    element = element.parentElement;
                } while (element !== null)

                return null
            };

        var el = Closest.call(root, selector);

        return el === root ? null : el
    };

    var getComputedStyles = function (el) {
        return isElement(el) ? window.getComputedStyle(el) : {}
    };

    /**
     * Various constants used across the project.
     */

    // Theme Colors
    var THEMECOLORS = [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'danger',
        'light',
        'dark'
    ];

    /**
     * EVENTS
     */

    // Accordion
    var COLLAPSE_EVENTS = {
        ACCORDION: 'collapse-accordion',
        TOGGLE: 'collapse-toggle',
        STATE: 'collapse-state'
    };

    // Modal events
    var MODAL_EVENTS = {
        HIDDEN: 'modal-hidden'
    };

    // Alert Events
    var ALERT_EVENTS = {
        DISMISS_COUNTDOWN: 'alert-dismiss-countdown',
        DISMISSED: 'alert-dismissed'
    };

    // Dropdown Events
    var DROPDOWN_EVENTS = {
        SHOWN: 'dropdown-shown',
        SHOW: 'dropdown-show',
        HIDE: 'dropdown-hide',
        HIDDEN: 'dropdown-hidden'
    };

    // Link Events
    var LINK_EVENTS = {
        CLICKED: 'link-clicked'
    };

    /**
     * TOOLTIP / POPOVER
     */

    // Tooltip / Popover placements
    var TP_PLACEMENTS = {
        TOP: 'top',
        TOPLEFT: 'topleft',
        TOPRIGHT: 'topright',
        RIGHT: 'right',
        RIGHTTOP: 'righttop',
        RIGHTBOTTOM: 'rightbottom',
        BOTTOM: 'bottom',
        BOTTOMLEFT: 'bottomleft',
        BOTTOMRIGHT: 'bottomright',
        LEFT: 'left',
        LEFTTOP: 'lefttop',
        LEFTBOTTOM: 'leftbottom',
        AUTO: 'auto'
    };

    // Normalized placements
    var N_TP_PLACEMENTS = {
        AUTO: 'auto',
        TOP: 'top',
        RIGHT: 'right',
        BOTTOM: 'bottom',
        LEFT: 'left',
        TOPLEFT: 'top',
        TOPRIGHT: 'top',
        RIGHTTOP: 'right',
        RIGHTBOTTOM: 'right',
        BOTTOMLEFT: 'bottom',
        BOTTOMRIGHT: 'bottom',
        LEFTTOP: 'left',
        LEFTBOTTOM: 'left'
    };

    // Tooltip/Popover offset map
    var TP_OFFSET_MAP = {
        AUTO: 0,
        TOPLEFT: -1,
        TOP: 0,
        TOPRIGHT: +1,
        RIGHTTOP: -1,
        RIGHT: 0,
        RIGHTBOTTOM: +1,
        BOTTOMLEFT: -1,
        BOTTOM: 0,
        BOTTOMRIGHT: +1,
        LEFTTOP: -1,
        LEFT: 0,
        LEFTBOTTOM: +1
    };

    // Popover state classes
    var TP_STATE_CLASSES = {
        FADE: 'fade',
        SHOW: 'show'
    };

    // Popover selectors
    var POPOVER_SELECTORS = {
        HEADER: '.popover-header',
        BODY: '.popover-body'
    };

    // Tooltip selectors
    var TOOLTIP_SELECTORS = {
        TOOLTIP: '.tooltip',
        TOOLTIP_INNER: '.tooltip-inner',
        ARROW: '.arrow'
    };

    // Tooltip hover state classes
    var TOOLTIP_HOVER_STATE_CLASSES = {
        SHOW: 'show',
        OUT: 'out'
    };

    /**
     * FORMS
     */

     var INPUT_TYPES = [
         'text',
         'password',
         'email',
         'number',
         'tel',
         'url',
         'search',
         'range',
         'color',
         'date',
         'time',
         'datetime',
         'datetime-local',
         'month',
         'week',
         'file'
     ];

     /**
      * EMBEDS
      */

    var EMBED_TYPES = [
        'iframe',
        'video',
        'embed',
        'object',
        'img',
        'd-img'
    ];

    var EMBED_ASPECTS = [
        '21by9',
        '16by9',
        '4by3',
        '1by1'
    ];

    // Keycodes
    var KEYCODES = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13,
        SPACE: 32
    };

    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script = {
        name: 'd-button-close',
        props: {
            /**
             * Whether it should be displayed as disabled, or not.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * The theme color value.
             */
            theme: {
                type: String,
                default: null
            },
            /**
             * The aria-label value.
             */
            ariaLabel: {
                type: String,
                default: 'Close'
            }
        },
        methods: {
            handleClick: function handleClick(e) {
                if (this.disabled && e instanceof Event) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                this.$emit('click', e);
            }
        }
    };

    /* script */
                var __vue_script__ = script;
                
    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "button",
        {
          class: ["close", _vm.theme ? "text-" + _vm.theme : ""],
          attrs: { disabled: _vm.disabled, "aria-label": _vm.ariaLabel },
          on: { click: _vm.handleClick }
        },
        [_vm._t("default", [_vm._v("×")])],
        2
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      var __vue_inject_styles__ = undefined;
      /* scoped */
      var __vue_scope_id__ = undefined;
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* component normalizer */
      function __vue_normalize__(
        template, style, script$$1,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/button/ButtonClose.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dBtnClose = __vue_normalize__(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        __vue_create_injector__,
        undefined
      );

    //

    var script$1 = {
        name: 'd-alert',
        components: {
            dButtonClose: dBtnClose
        },
        props: {
            /**
             * Alert color theme.
             */
            theme: {
                type: String,
                default: 'primary',
                validator: function (v) { return THEMECOLORS.includes(v); }
            },
            /**
             * Whether the alert is dismissible, or not.
             */
            dismissible: {
                type: Boolean,
                default: false
            },
            /**
             * Dismiss button label.
             */
            dismissLabel: {
                type: String,
                default: 'Close'
            },
            /**
             * Show state or duration.
             */
            show: {
                type: [Boolean, Number, String],
                default: false
            }
        },
        model: {
            prop: 'show',
            event: 'input'
        },
        data: function data() {
            return {
                timer: null,
                dismissed: false
            }
        },
        watch: {
            show: function show() {
                this.showChanged();
            }
        },
        mounted: function mounted() {
            this.showChanged();
        },
        destroyed: function destroyed() {
            this.clearCounter();
        },
        computed: {
            computedShow: function computedShow() {
                return !this.dismissed && (this.timer || this.show);
            }
        },
        methods: {
            clearCounter: function clearCounter() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },

            dismiss: function dismiss() {
                this.clearCounter();
                this.dismissed = true;

                /**
                 * Alert dismissed event.
                 *
                 * @event alert-dismissed
                 * @type {Boolean}
                 */
                this.$emit(ALERT_EVENTS.DISMISSED);
                this.$emit('input', false);

                if (typeof this.show === 'boolean') {
                    this.$emit('input', false);
                    return;
                }

                /**
                 * Alert dismiss countdown event.
                 *
                 * @event alert-dismiss-countdown
                 * @type {Number}
                 */
                this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, 0);
                this.$emit('input', 0);
            },

            showChanged: function showChanged() {
                var this$1 = this;

                this.clearCounter();
                this.dismissed = false;

                if (typeof this.show === 'boolean' || this.show === null || this.show === 0)
                    { return }

                var dismissTimer = this.show;
                this.timer = setInterval(function () {
                    if (dismissTimer < 1) {
                        this$1.dismiss();
                        return;
                    }

                    dismissTimer--;

                    /**
                     * Alert dismiss countdown event.
                     *
                     * @event alert-dismiss-countdown
                     * @type {Number}
                     */
                    this$1.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, dismissTimer);
                    this$1.$emit('input', dismissTimer);
                }, 1000);
            }
        }
    };

    /* script */
                var __vue_script__$1 = script$1;
                
    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.computedShow
        ? _c(
            "div",
            {
              class: [
                "alert",
                _vm.theme ? "alert-" + _vm.theme : "",
                _vm.dismissible ? "alert-dismissible" : ""
              ],
              attrs: { role: "alert", "aria-live": "polite", "aria-atomic": "true" }
            },
            [
              _vm._t("default"),
              _vm._v(" "),
              _vm.dismissible
                ? _c("d-button-close", {
                    attrs: { "aria-label": _vm.dismissLabel, href: "#" },
                    on: { click: _vm.dismiss }
                  })
                : _vm._e()
            ],
            2
          )
        : _vm._e()
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      var __vue_inject_styles__$1 = function (inject) {
        if (!inject) { return }
        inject("data-v-843c744c_0", { source: "\n.close[data-v-843c744c] {\n    min-height: 100%;\n    padding: 0.625rem 1.25rem 0.75rem 1.25rem;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/alert/Alert.vue"],"names":[],"mappings":";AAuJA;IACA,iBAAA;IACA,0CAAA;CACA","file":"Alert.vue","sourcesContent":["<template>\n    <div v-if=\"computedShow\"\n        role=\"alert\"\n        aria-live=\"polite\"\n        aria-atomic=\"true\"\n        :class=\"[\n            'alert',\n            theme ? `alert-${theme}` : '',\n            dismissible ? `alert-dismissible` : ''\n        ]\">\n        <slot />\n        <d-button-close v-if=\"dismissible\"\n            :aria-label=\"dismissLabel\"\n            @click=\"dismiss\"\n            href=\"#\" />\n    </div>\n</template>\n\n<script>\nimport { THEMECOLORS, ALERT_EVENTS } from '../../utils/constants';\nimport dButtonClose from '../button/ButtonClose.vue';\n\nexport default {\n    name: 'd-alert',\n    components: {\n        dButtonClose\n    },\n    props: {\n        /**\n         * Alert color theme.\n         */\n        theme: {\n            type: String,\n            default: 'primary',\n            validator: v => THEMECOLORS.includes(v)\n        },\n        /**\n         * Whether the alert is dismissible, or not.\n         */\n        dismissible: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Dismiss button label.\n         */\n        dismissLabel: {\n            type: String,\n            default: 'Close'\n        },\n        /**\n         * Show state or duration.\n         */\n        show: {\n            type: [Boolean, Number, String],\n            default: false\n        }\n    },\n    model: {\n        prop: 'show',\n        event: 'input'\n    },\n    data() {\n        return {\n            timer: null,\n            dismissed: false\n        }\n    },\n    watch: {\n        show() {\n            this.showChanged();\n        }\n    },\n    mounted() {\n        this.showChanged();\n    },\n    destroyed() {\n        this.clearCounter();\n    },\n    computed: {\n        computedShow() {\n            return !this.dismissed && (this.timer || this.show);\n        }\n    },\n    methods: {\n        clearCounter() {\n            if (this.timer) {\n                clearInterval(this.timer);\n                this.timer = null;\n            }\n        },\n\n        dismiss() {\n            this.clearCounter();\n            this.dismissed = true;\n\n            /**\n             * Alert dismissed event.\n             *\n             * @event alert-dismissed\n             * @type {Boolean}\n             */\n            this.$emit(ALERT_EVENTS.DISMISSED);\n            this.$emit('input', false);\n\n            if (typeof this.show === 'boolean') {\n                this.$emit('input', false);\n                return;\n            }\n\n            /**\n             * Alert dismiss countdown event.\n             *\n             * @event alert-dismiss-countdown\n             * @type {Number}\n             */\n            this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, 0);\n            this.$emit('input', 0);\n        },\n\n        showChanged() {\n            this.clearCounter();\n            this.dismissed = false;\n\n            if (typeof this.show === 'boolean' || this.show === null || this.show === 0)\n                return\n\n            let dismissTimer = this.show;\n            this.timer = setInterval(() => {\n                if (dismissTimer < 1) {\n                    this.dismiss();\n                    return;\n                }\n\n                dismissTimer--;\n\n                /**\n                 * Alert dismiss countdown event.\n                 *\n                 * @event alert-dismiss-countdown\n                 * @type {Number}\n                 */\n                this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, dismissTimer);\n                this.$emit('input', dismissTimer);\n            }, 1000);\n        }\n    }\n}\n</script>\n\n<style scoped>\n.close {\n    min-height: 100%;\n    padding: 0.625rem 1.25rem 0.75rem 1.25rem;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$1 = "data-v-843c744c";
      /* module identifier */
      var __vue_module_identifier__$1 = undefined;
      /* functional template */
      var __vue_is_functional_template__$1 = false;
      /* component normalizer */
      function __vue_normalize__$1(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/alert/Alert.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$1() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dAlert = __vue_normalize__$1(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        __vue_create_injector__$1,
        undefined
      );

    var components = {
        dAlert: dAlert
    };

    var VuePlugin = {
      install: function install (Vue) {
        registerComponents(Vue, components);
      }
    };

    vueUse(VuePlugin);

    var _DR_RL_ = '_DR_RL_';

    var rootListenerMixin = {
        methods: {
            listenOnRoot: function listenOnRoot(event, callback) {
                if (!this[_DR_RL_] || !isArray(this[_DR_RL_])) {
                    this[_DR_RL_] = [];
                }

                this[_DR_RL_].push({ event: event, callback: callback });
                this.$root.$on(event, callback);

                return this
            },
            emitOnRoot: function emitOnRoot(event) {
                var ref;

                var args = [], len = arguments.length - 1;
                while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
                (ref = this.$root).$emit.apply(ref, [ event ].concat( args ));
                return this
            }
        },
        beforeDestroy: function beforeDestroy() {
            var this$1 = this;

            if (!this[_DR_RL_] && !isArray(this[_DR_RL_])) {
                return
            }

            while (this[_DR_RL_].length > 0) {
                var ref = this$1[_DR_RL_].shift();
                var event = ref.event;
                var callback = ref.callback;
                this$1.$root.$off(event, callback);
            }
        }
    };

    //

    var script$2 = {
        name: 'd-link',
        mixins: [ rootListenerMixin ],
        props: {
            /**
             * The link href.
             */
            href: {
                type: String,
                default: null
            },
            /**
             * The router location.
             */
            to: {
                type: [String, Object],
                default: null
            },
            /**
             * Whether the link is disabled, or not.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * The link target.
             */
            target: {
                type: String,
                default: '_self'
            },
            /**
             * The link rel.
             */
            rel: {
                type: String,
                default: null
            },
            /**
             * Whether the route is exact, or not.
             */
            exact: {
                type: Boolean,
                default: false
            },
            /**
             * The class name attached when the route is exact,
             */
            exactActiveClass: {
                type: String
            },
            /**
             * Whether the link is active, or not.
             */
            active: {
                type: Boolean,
                default: false
            },
            /**
             * The class applied when the link is active.
             */
            activeClass: {
                type: String
            },
            /**
             * The component tag.
             */
            tag: {
                type: String,
                default: 'a'
            }
        },
        computed: {
            computedTag: function computedTag() {
                return this.to
                    && !this.disabled
                    && Boolean(this.$parent.$router) ? 'router-link' : 'a'
            },
            computedRel: function computedRel() {
                return this.target === '_blank'
                    && this.rel === null ? 'noopener' : this.rel || null
            },
            computedHref: function computedHref() {
                if (this.computedTag === 'router-link') {
                    return;
                }

                if (this.href) {
                    return this.href;
                }

                if (this.to) {
                    if (typeof this.to === 'string') {
                        return this.to;
                    }

                    if (typeof this.to === 'object' && this.to.path) {
                        return this.to.path;
                    }
                }

                return '#';
            },
            computedTabindex: function computedTabindex() {
                return this.disabled ? '-1' : (this.$attrs ? this.$attrs.tabindex : null);
            },
            computedAriaDisabled: function computedAriaDisabled() {
                return (this.tag === 'a' && this.disabled) ? 'true' : null;
            }
        },
        methods: {
            handleClick: function handleClick(event) {
                var isRouterLink = this.computedTag === 'router-link';

                if (this.disabled && event instanceof Event) {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                } else {
                    if (isRouterLink && event.target.__vue__) {
                        event.target.__vue__.$emit('click', event);
                    } else {
                        this.$emit('click', event);
                    }

                    this.emitOnRoot(LINK_EVENTS.CLICKED, event);
                }

                if ((!isRouterLink && this.computedHref === '#') || this.disabled) {
                    event.preventDefault();
                }
            }
        }
    };

    /* script */
                var __vue_script__$2 = script$2;
                
    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.computedTag,
        _vm._b(
          {
            tag: "component",
            class: [
              _vm.active
                ? _vm.exact
                  ? _vm.exactActiveClass
                  : _vm.activeClass
                : "",
              _vm.disabled ? "disabled" : ""
            ],
            attrs: {
              rel: _vm.computedRel,
              href: _vm.computedHref,
              target: _vm.target,
              to: _vm.to,
              tabindex: _vm.computedTabindex,
              "aria-disabled": _vm.computedAriaDisabled
            },
            nativeOn: {
              click: function($event) {
                return _vm.handleClick($event)
              }
            }
          },
          "component",
          _vm.$props,
          false
        ),
        [_vm._t("default", [_vm._v("Link")])],
        2
      )
    };
    var __vue_staticRenderFns__$2 = [];
    __vue_render__$2._withStripped = true;

      /* style */
      var __vue_inject_styles__$2 = undefined;
      /* scoped */
      var __vue_scope_id__$2 = undefined;
      /* module identifier */
      var __vue_module_identifier__$2 = undefined;
      /* functional template */
      var __vue_is_functional_template__$2 = false;
      /* component normalizer */
      function __vue_normalize__$2(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/link/Link.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$2() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$2.styles || (__vue_create_injector__$2.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dLink = __vue_normalize__$2(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        __vue_create_injector__$2,
        undefined
      );

    function createLinkProps() {
        return {
            href: {
                type: String,
                default: null
            },
            to: {
                type: [String, Object],
                default: null
            },
            disabled: {
                type: Boolean,
                default: false
            },
            target: {
                type: String,
                default: '_self'
            },
            rel: {
                type: String,
                default: null
            },
            exact: {
                type: Boolean,
                default: false
            },
            exactActiveClass: {
                type: String
            },
            active: {
                type: Boolean,
                default: false
            },
            activeClass: {
                type: String
            },
            tag: {
                type: String,
                default: 'a'
            },
            routerTag: {
                type: String,
                default: 'a'
            },
            event: {
                type: [String, Array],
                default: 'click'
            },
            append: {
                type: Boolean,
                default: false
            }
        }
    }

    //

    /**
     * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
     */
    var script$3 = {
        name: 'd-badge',
        components: {
            dLink: dLink
        },
        props: Object.assign({}, createLinkProps(), {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'span'
            },
            /**
             * The theme color.
             */
            theme: {
                type: String,
                default: 'primary',
                validator: function (v) { return THEMECOLORS.includes(v); }
            },
            /**
             * Whether it should be displayed as a pill, or not.
             */
            pill: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be displayed with an outline, or not.
             */
            outline: {
                type: Boolean,
                default: false
            }
        }),
        computed: {
            computedTag: function computedTag() {
                return this.href || this.to ? 'd-link' : this.tag
            }
        }
    };

    /* script */
                var __vue_script__$3 = script$3;
                
    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.computedTag,
        {
          tag: "component",
          class: [
            "badge",
            _vm.theme && !_vm.outline ? "badge-" + _vm.theme : "",
            _vm.outline ? "badge-outline-" + _vm.theme : "",
            _vm.pill ? "badge-pill" : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$3 = [];
    __vue_render__$3._withStripped = true;

      /* style */
      var __vue_inject_styles__$3 = undefined;
      /* scoped */
      var __vue_scope_id__$3 = undefined;
      /* module identifier */
      var __vue_module_identifier__$3 = undefined;
      /* functional template */
      var __vue_is_functional_template__$3 = false;
      /* component normalizer */
      function __vue_normalize__$3(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/badge/Badge.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$3() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$3.styles || (__vue_create_injector__$3.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dBadge = __vue_normalize__$3(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        __vue_create_injector__$3,
        undefined
      );

    var components$1 = {
        dBadge: dBadge
    };

    var VuePlugin$1 = {
      install: function install (Vue) {
        registerComponents(Vue, components$1);
      }
    };

    vueUse(VuePlugin$1);

    //

    /**
     * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
     */
    var script$4 = {
        name: 'd-breadcrumb-link',
        components: {
            dLink: dLink
        },
        props: Object.assign({}, createLinkProps(), {
            /**
             * The breadcrumb link text.
             */
            text: {
                type: String,
                default: null
            },
            /**
             * The active state.
             */
            active: {
                type: Boolean,
                default: false
            },
            /**
             * The href.
             */
            href: {
                type: String,
                default: '#'
            },
            /**
             * The aria-current state.
             */
            ariaCurrent: {
                type: String,
                default: 'location'
            }
        }),
        computed: {
            computedTag: function computedTag() {
                return this.active ? 'span' : 'd-link'
            }
        }
    };

    /* script */
                var __vue_script__$4 = script$4;
                
    /* template */
    var __vue_render__$4 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(_vm.computedTag, {
        tag: "component",
        attrs: { "aria-current": _vm.ariaCurrent, href: _vm.href },
        domProps: { innerHTML: _vm._s(_vm.text) }
      })
    };
    var __vue_staticRenderFns__$4 = [];
    __vue_render__$4._withStripped = true;

      /* style */
      var __vue_inject_styles__$4 = undefined;
      /* scoped */
      var __vue_scope_id__$4 = undefined;
      /* module identifier */
      var __vue_module_identifier__$4 = undefined;
      /* functional template */
      var __vue_is_functional_template__$4 = false;
      /* component normalizer */
      function __vue_normalize__$4(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/breadcrumb/BreadcrumbLink.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$4() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$4.styles || (__vue_create_injector__$4.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var BreadcrumbLink = __vue_normalize__$4(
        { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
        __vue_inject_styles__$4,
        __vue_script__$4,
        __vue_scope_id__$4,
        __vue_is_functional_template__$4,
        __vue_module_identifier__$4,
        __vue_create_injector__$4,
        undefined
      );

    //

    var script$5 = {
        name: 'd-breadcrumb-item',
        components: {
            BreadcrumbLink: BreadcrumbLink
        },
        props: {
            /**
             * The breadcrumb item text.
             */
            text: {
                type: String,
                default: null
            },
            /**
             * The breadcrumb item href.
             */
            href: {
                type: String,
                default: '#'
            },
            /**
             * Whether it is active, or not.
             */
            active: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$5 = script$5;
                
    /* template */
    var __vue_render__$5 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "li",
        {
          class: ["breadcrumb-item", _vm.active ? "active" : ""],
          attrs: { role: "presentation" }
        },
        [
          !_vm.active
            ? _c("BreadcrumbLink", { attrs: { text: _vm.text, href: _vm.href } })
            : _vm._e(),
          _vm._v(" "),
          _vm.active ? _c("span", [_vm._v(_vm._s(_vm.text))]) : _vm._e()
        ],
        1
      )
    };
    var __vue_staticRenderFns__$5 = [];
    __vue_render__$5._withStripped = true;

      /* style */
      var __vue_inject_styles__$5 = undefined;
      /* scoped */
      var __vue_scope_id__$5 = undefined;
      /* module identifier */
      var __vue_module_identifier__$5 = undefined;
      /* functional template */
      var __vue_is_functional_template__$5 = false;
      /* component normalizer */
      function __vue_normalize__$5(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/breadcrumb/BreadcrumbItem.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$5() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$5.styles || (__vue_create_injector__$5.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var BreadcrumbItem = __vue_normalize__$5(
        { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
        __vue_inject_styles__$5,
        __vue_script__$5,
        __vue_scope_id__$5,
        __vue_is_functional_template__$5,
        __vue_module_identifier__$5,
        __vue_create_injector__$5,
        undefined
      );

    //

    var script$6 = {
        name: 'd-breadcrumb',
        components: {
            BreadcrumbItem: BreadcrumbItem
        },
        props: {
            /**
             * The breadcrumb items array.
             */
            items: {
                type: Array,
                default: null
            }
        },
        computed: {
            computedItems: function computedItems() {
                var this$1 = this;

                var isActiveDefined = false;

                if (!this.items || !this.items.length) {
                    return []
                }

                return this.items.map(function (item, idx) {
                    if (typeof item !== 'object') {
                        item = { text: item };
                    }

                    if (item.active) {
                        isActiveDefined = true;
                    }

                    if (!item.active && !isActiveDefined) {
                        item.active = idx + 1 === this$1.items.length;
                    }

                    return item
                })
            }
        }
    };

    /* script */
                var __vue_script__$6 = script$6;
                
    /* template */
    var __vue_render__$6 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "ol",
        { staticClass: "breadcrumb" },
        [
          _vm._l(_vm.computedItems, function(item, index) {
            return _c("BreadcrumbItem", {
              key: "dr-breadcrumb-" + index,
              attrs: { active: item.active, text: item.text, href: item.href }
            })
          }),
          _vm._v(" "),
          _vm._t("default")
        ],
        2
      )
    };
    var __vue_staticRenderFns__$6 = [];
    __vue_render__$6._withStripped = true;

      /* style */
      var __vue_inject_styles__$6 = undefined;
      /* scoped */
      var __vue_scope_id__$6 = undefined;
      /* module identifier */
      var __vue_module_identifier__$6 = undefined;
      /* functional template */
      var __vue_is_functional_template__$6 = false;
      /* component normalizer */
      function __vue_normalize__$6(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/breadcrumb/Breadcrumb.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$6() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$6.styles || (__vue_create_injector__$6.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dBreadcrumb = __vue_normalize__$6(
        { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
        __vue_inject_styles__$6,
        __vue_script__$6,
        __vue_scope_id__$6,
        __vue_is_functional_template__$6,
        __vue_module_identifier__$6,
        __vue_create_injector__$6,
        undefined
      );

    var components$2 = {
        dLink: dLink,
        dBreadcrumb: dBreadcrumb,
        dBreadcrumbItem: BreadcrumbItem,
        dBreadcrumbLink: BreadcrumbLink
    };

    var VuePlugin$2 = {
      install: function install (Vue) {
        registerComponents(Vue, components$2);
      }
    };

    vueUse(VuePlugin$2);

    //

    var script$7 = {
        name: 'd-button',
        props: {
            /**
             * The theme style.
             */
            theme: {
                type: String,
                validator: function (v) { return THEMECOLORS.includes(v); },
                default: 'primary'
            },
            /**
             * Whether it should be displayed as an outline, or not.
             */
            outline: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be displayed as a pill, or not.
             */
            pill: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be displayed as a squared, or not.
             */
            squared: {
                type: Boolean,
                default: false
            },
            /**
             * The button's sizesize.
             */
            size: {
                type: String,
                validator: function (v) { return ['sm', 'lg', null].includes(v); },
                default: null
            },
            /**
             * Whether it should be displayed as block, or not.
             */
            blockLevel: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be displayed as disabled, or not.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be displayed as active, or not.
             */
            active: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            sizeClass: function sizeClass() {
                if (this.size && this.size !== '') {
                    return ("btn-" + (this.size));
                }

                return this.size;
            },

            themeClass: function themeClass() {
                return this.theme ? ("btn-" + (this.outline ? 'outline-' : '') + (this.theme)) : '';
            }
        },
        methods: {
            /**
             * Triggered when the button is clicked.
             *
             * @event click
             */
            handleClick: function handleClick(e) {
                this.$emit('click', e);
            }
        }
    };

    /* script */
                var __vue_script__$7 = script$7;
                
    /* template */
    var __vue_render__$7 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "button",
        {
          staticClass: "btn",
          class: [
            _vm.themeClass,
            _vm.sizeClass,
            _vm.pill ? "btn-pill" : "",
            _vm.squared ? "btn-squared" : "",
            _vm.blockLevel ? "btn-block" : "",
            _vm.active ? "active" : ""
          ],
          attrs: { disabled: this.disabled, "aria-pressed": this.active },
          on: { click: _vm.handleClick }
        },
        [_vm._t("default", [_vm._v("Button")])],
        2
      )
    };
    var __vue_staticRenderFns__$7 = [];
    __vue_render__$7._withStripped = true;

      /* style */
      var __vue_inject_styles__$7 = undefined;
      /* scoped */
      var __vue_scope_id__$7 = undefined;
      /* module identifier */
      var __vue_module_identifier__$7 = undefined;
      /* functional template */
      var __vue_is_functional_template__$7 = false;
      /* component normalizer */
      function __vue_normalize__$7(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/button/Button.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$7() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$7.styles || (__vue_create_injector__$7.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dButton = __vue_normalize__$7(
        { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
        __vue_inject_styles__$7,
        __vue_script__$7,
        __vue_scope_id__$7,
        __vue_is_functional_template__$7,
        __vue_module_identifier__$7,
        __vue_create_injector__$7,
        undefined
      );

    var components$3 = {
        dButton: dButton,
        dBtn: dButton,
        dButtonClose: dBtnClose,
        dBtnClose: dBtnClose
    };

    var VuePlugin$3 = {
      install: function install (Vue) {
        registerComponents(Vue, components$3);
      }
    };

    vueUse(VuePlugin$3);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$8 = {
        name: 'd-button-group',
        props: {
            /**
             * Whether it is a vertical button group, or not.
             */
            vertical: {
                type: Boolean,
                default: false
            },
            /**
             * The button group size.
             */
            size: {
                type: String,
                validator: function (v) { return ['small', 'large', null].includes(v); },
                default: null
            },
            /**
             * The button group's aria role.
             */
            ariaRole: {
                type: String,
                default: 'group'
            },
            /**
             * The button group's aria label.
             */
            ariaLabel: {
                type: String,
                default: 'Button group'
            }
        },
        computed: {
            btnGroupSizeClass: function btnGroupSizeClass() {
                var buttonGroupSizes = { small: 'sm', large: 'lg' };

                if (this.size !== '') {
                    return ("btn-group-" + (buttonGroupSizes[this.size]));
                }

                return this.size;
            }
        }
    };

    /* script */
                var __vue_script__$8 = script$8;
                
    /* template */
    var __vue_render__$8 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            _vm.btnGroupSizeClass,
            _vm.vertical ? "btn-group-vertical" : "btn-group"
          ],
          attrs: { "aria-role": _vm.ariaRole, "aria-label": _vm.ariaLabel }
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$8 = [];
    __vue_render__$8._withStripped = true;

      /* style */
      var __vue_inject_styles__$8 = function (inject) {
        if (!inject) { return }
        inject("data-v-47e3f48c_0", { source: "\n.btn-group-vertical .btn + .btn[data-v-47e3f48c] {\n  margin-left: 0 !important;\n}\n\n/*# sourceMappingURL=ButtonGroup.vue.map */", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/button-group/ButtonGroup.vue","ButtonGroup.vue"],"names":[],"mappings":";AA6DA;EACA,0BAAA;CACA;;AC5DA,2CAA2C","file":"ButtonGroup.vue","sourcesContent":[null,".btn-group-vertical .btn + .btn {\n  margin-left: 0 !important; }\n\n/*# sourceMappingURL=ButtonGroup.vue.map */"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$8 = "data-v-47e3f48c";
      /* module identifier */
      var __vue_module_identifier__$8 = undefined;
      /* functional template */
      var __vue_is_functional_template__$8 = false;
      /* component normalizer */
      function __vue_normalize__$8(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/button-group/ButtonGroup.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$8() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$8.styles || (__vue_create_injector__$8.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dButtonGroup = __vue_normalize__$8(
        { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
        __vue_inject_styles__$8,
        __vue_script__$8,
        __vue_scope_id__$8,
        __vue_is_functional_template__$8,
        __vue_module_identifier__$8,
        __vue_create_injector__$8,
        undefined
      );

    var components$4 = {
        dButtonGroup: dButtonGroup,
        sBtnGroup: dButtonGroup
    };

    var VuePlugin$4 = {
      install: function install (Vue) {
        registerComponents(Vue, components$4);
      }
    };

    vueUse(VuePlugin$4);

    //
    //
    //
    //
    //
    //
    //
    //

    var script$9 = {
        name: 'd-button-toolbar',
        props: {
            /**
             * Button toolbar aria role.
             */
            ariaRole: {
                type: String,
                default: 'toolbar'
            },
            /**
             * Button toolbar aria label.
             */
            ariaLabel: {
                type: String,
                default: 'Button toolbar'
            }
        }
    };

    /* script */
                var __vue_script__$9 = script$9;
                
    /* template */
    var __vue_render__$9 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "btn-toolbar",
          attrs: { "aria-role": _vm.ariaRole, "aria-label": _vm.ariaLabel }
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$9 = [];
    __vue_render__$9._withStripped = true;

      /* style */
      var __vue_inject_styles__$9 = undefined;
      /* scoped */
      var __vue_scope_id__$9 = undefined;
      /* module identifier */
      var __vue_module_identifier__$9 = undefined;
      /* functional template */
      var __vue_is_functional_template__$9 = false;
      /* component normalizer */
      function __vue_normalize__$9(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/button-toolbar/ButtonToolbar.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$9() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$9.styles || (__vue_create_injector__$9.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dButtonToolbar = __vue_normalize__$9(
        { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
        __vue_inject_styles__$9,
        __vue_script__$9,
        __vue_scope_id__$9,
        __vue_is_functional_template__$9,
        __vue_module_identifier__$9,
        __vue_create_injector__$9,
        undefined
      );

    var components$5 = {
        dButtonToolbar: dButtonToolbar,
        dBtnToolbar: dButtonToolbar
    };

    var VuePlugin$5 = {
      install: function install (Vue) {
        registerComponents(Vue, components$5);
      }
    };

    vueUse(VuePlugin$5);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$a = {
        name: 'd-card',
        props: {
            /**
             * Element tag type.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Background theme color.
             */
            bgTheme: {
                type: String,
                default: null
            },
            /**
             * Border theme color.
             */
            borderTheme: {
                type: String,
                default: null
            },
            /**
             * Text theme color.
             */
            textTheme: {
                type: String,
                default: null
            },
            /**
             * Alignment
             */
            align: {
                type: String,
                default: null
            }
        }
    };

    /* script */
                var __vue_script__$a = script$a;
                
    /* template */
    var __vue_render__$a = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        _vm._g(
          _vm._b(
            {
              tag: "component",
              class: [
                "card",
                Boolean(_vm.align) ? "text-" + _vm.align : "",
                Boolean(_vm.bgTheme) ? "bg-" + _vm.bgTheme : "",
                Boolean(_vm.borderTheme) ? "border-" + _vm.borderTheme : "",
                Boolean(_vm.textTheme) ? "text-" + _vm.textTheme : ""
              ]
            },
            "component",
            _vm.$attrs,
            false
          ),
          _vm.$listeners
        ),
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$a = [];
    __vue_render__$a._withStripped = true;

      /* style */
      var __vue_inject_styles__$a = undefined;
      /* scoped */
      var __vue_scope_id__$a = undefined;
      /* module identifier */
      var __vue_module_identifier__$a = undefined;
      /* functional template */
      var __vue_is_functional_template__$a = false;
      /* component normalizer */
      function __vue_normalize__$a(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/card/Card.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$a() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$a.styles || (__vue_create_injector__$a.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCard = __vue_normalize__$a(
        { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
        __vue_inject_styles__$a,
        __vue_script__$a,
        __vue_scope_id__$a,
        __vue_is_functional_template__$a,
        __vue_module_identifier__$a,
        __vue_create_injector__$a,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$b = {
        name: 'd-card-body',
        props: {
            /**
             * Element tag type.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Background theme color.
             */
            bgTheme: {
                type: String,
                default: null
            },
            /**
             * Border theme color.
             */
            borderTheme: {
                type: String,
                default: null
            },
            /**
             * Text theme color.
             */
            textTheme: {
                type: String,
                default: null
            },
            /**
             * Body class.
             */
            bodyClass: {
                type: String,
                default: ''
            },
            /**
             * Body title value.
             */
            title: {
                type: String,
                default: null
            },
            /**
             * Body title element tag type.
             */
            titleTag: {
                type: String,
                default: 'h4'
            },
            /**
             * Body subtitle value.
             */
            subtitle: {
                type: String,
                default: null
            },
            /**
             * Body subtitle element tag type.
             */
            subtitleTag: {
                type: String,
                default: 'h6'
            },
            /**
             * Overlay.
             */
            overlay: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$b = script$b;
                
    /* template */
    var __vue_render__$b = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "card-body",
            _vm.overlay ? "card-img-overlay" : "",
            Boolean(_vm.bgTheme) ? "bg-" + _vm.bgTheme : "",
            Boolean(_vm.borderTheme) ? "border-" + _vm.borderTheme : "",
            Boolean(_vm.textTheme) ? "text-" + _vm.textTheme : "",
            _vm.bodyClass
          ]
        },
        [
          _vm.title
            ? _c(_vm.titleTag, {
                tag: "component",
                staticClass: "card-title",
                domProps: { innerHTML: _vm._s(_vm.title) }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.subtitle
            ? _c(_vm.subtitleTag, {
                tag: "component",
                staticClass: "card-subtitle mb-2 text-muted",
                domProps: { innerHTML: _vm._s(_vm.subtitle) }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm._t("default")
        ],
        2
      )
    };
    var __vue_staticRenderFns__$b = [];
    __vue_render__$b._withStripped = true;

      /* style */
      var __vue_inject_styles__$b = undefined;
      /* scoped */
      var __vue_scope_id__$b = undefined;
      /* module identifier */
      var __vue_module_identifier__$b = undefined;
      /* functional template */
      var __vue_is_functional_template__$b = false;
      /* component normalizer */
      function __vue_normalize__$b(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/card/CardBody.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$b() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$b.styles || (__vue_create_injector__$b.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCardBody = __vue_normalize__$b(
        { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
        __vue_inject_styles__$b,
        __vue_script__$b,
        __vue_scope_id__$b,
        __vue_is_functional_template__$b,
        __vue_module_identifier__$b,
        __vue_create_injector__$b,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$c = {
        name: 'd-card-footer',
        props: {
            /**
             * Element tag type.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Background theme color.
             */
            bgTheme: {
                type: String,
                default: null
            },
            /**
             * Border theme color.
             */
            borderTheme: {
                type: String,
                default: null
            },
            /**
             * Text theme color.
             */
            textTheme: {
                type: String,
                default: null
            },
            /**
             * Footer value.
             */
            footer: {
                type: String,
                default: null
            },
            /**
             * Footer class.
             */
            footerClass: {
                type: String,
                default: ''
            }
        }
    };

    /* script */
                var __vue_script__$c = script$c;
                
    /* template */
    var __vue_render__$c = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "card-footer",
            Boolean(_vm.bgTheme) ? "bg-" + _vm.bgTheme : "",
            Boolean(_vm.borderTheme) ? "border-" + _vm.borderTheme : "",
            Boolean(_vm.textTheme) ? "text-" + _vm.textTheme : "",
            _vm.footerClass
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$c = [];
    __vue_render__$c._withStripped = true;

      /* style */
      var __vue_inject_styles__$c = undefined;
      /* scoped */
      var __vue_scope_id__$c = undefined;
      /* module identifier */
      var __vue_module_identifier__$c = undefined;
      /* functional template */
      var __vue_is_functional_template__$c = false;
      /* component normalizer */
      function __vue_normalize__$c(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/card/CardFooter.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$c() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$c.styles || (__vue_create_injector__$c.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCardFooter = __vue_normalize__$c(
        { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
        __vue_inject_styles__$c,
        __vue_script__$c,
        __vue_scope_id__$c,
        __vue_is_functional_template__$c,
        __vue_module_identifier__$c,
        __vue_create_injector__$c,
        undefined
      );

    //
    //
    //
    //
    //
    //

    var script$d = {
        name: 'd-card-group',
        props: {
            /**
             * Component tag type.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether it should be displayed as a deck, or not.
             */
            deck: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be displayed as columns, or not.
             */
            columns: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedClass: function computedClass() {
                if (this.columns) {
                    return 'card-columns'
                }

                if (this.deck) {
                    return 'card-deck'
                }

                return 'card-group'
            }
        }
    };

    /* script */
                var __vue_script__$d = script$d;
                
    /* template */
    var __vue_render__$d = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", class: _vm.computedClass },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$d = [];
    __vue_render__$d._withStripped = true;

      /* style */
      var __vue_inject_styles__$d = undefined;
      /* scoped */
      var __vue_scope_id__$d = undefined;
      /* module identifier */
      var __vue_module_identifier__$d = undefined;
      /* functional template */
      var __vue_is_functional_template__$d = false;
      /* component normalizer */
      function __vue_normalize__$d(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/card/CardGroup.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$d() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$d.styles || (__vue_create_injector__$d.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCardGroup = __vue_normalize__$d(
        { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
        __vue_inject_styles__$d,
        __vue_script__$d,
        __vue_scope_id__$d,
        __vue_is_functional_template__$d,
        __vue_module_identifier__$d,
        __vue_create_injector__$d,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$e = {
        name: 'd-card-header',
        props: {
            /**
             * Element tag type.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Background theme color.
             */
            bgTheme: {
                type: String,
                default: null
            },
            /**
             * Border theme color.
             */
            borderTheme: {
                type: String,
                default: null
            },
            /**
             * Text theme color.
             */
            textTheme: {
                type: String,
                default: null
            },
            /**
             * Header value.
             */
            header: {
                type: String,
                default: null
            },
            /**
             * Header class.
             */
            headerClass: {
                type: String,
                default: ''
            }
        }
    };

    /* script */
                var __vue_script__$e = script$e;
                
    /* template */
    var __vue_render__$e = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "card-header",
            Boolean(_vm.bgTheme) ? "bg-" + _vm.bgTheme : "",
            Boolean(_vm.borderTheme) ? "border-" + _vm.borderTheme : "",
            Boolean(_vm.textTheme) ? "text-" + _vm.textTheme : "",
            _vm.headerClass
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$e = [];
    __vue_render__$e._withStripped = true;

      /* style */
      var __vue_inject_styles__$e = undefined;
      /* scoped */
      var __vue_scope_id__$e = undefined;
      /* module identifier */
      var __vue_module_identifier__$e = undefined;
      /* functional template */
      var __vue_is_functional_template__$e = false;
      /* component normalizer */
      function __vue_normalize__$e(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/card/CardHeader.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$e() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$e.styles || (__vue_create_injector__$e.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCardHeader = __vue_normalize__$e(
        { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
        __vue_inject_styles__$e,
        __vue_script__$e,
        __vue_scope_id__$e,
        __vue_is_functional_template__$e,
        __vue_module_identifier__$e,
        __vue_create_injector__$e,
        undefined
      );

    //
    //
    //
    //

    var script$f = {
        name: 'd-card-img',
        props: {
            /**
             * The image source.
             */
            src: {
                type: String,
                default: null,
                required: true
            },
            /**
             * Alternative image text.
             */
            alt: {
                type: String,
                default: null
            },
            /**
             * Top positioned.
             */
            top: {
                type: Boolean,
                default: false
            },
            /**
             * Bottom positioned.
             */
            bottom: {
                type: Boolean,
                default: false
            },
            /**
             * Fluid display.
             */
            fluid: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedClass: function computedClass() {
                var _classList = [];

                _classList.push(this.fluid ? 'img-fluid' : '');

                if (this.top && !this.bottom) {
                    _classList.push('card-img-top');
                }

                if (this.bottom && !this.top) {
                    _classList.push('card-img-bottom');
                }

                return _classList
            }
        }
    };

    /* script */
                var __vue_script__$f = script$f;
                
    /* template */
    var __vue_render__$f = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("img", {
        class: _vm.computedClass,
        attrs: { src: _vm.src, alt: _vm.alt }
      })
    };
    var __vue_staticRenderFns__$f = [];
    __vue_render__$f._withStripped = true;

      /* style */
      var __vue_inject_styles__$f = undefined;
      /* scoped */
      var __vue_scope_id__$f = undefined;
      /* module identifier */
      var __vue_module_identifier__$f = undefined;
      /* functional template */
      var __vue_is_functional_template__$f = false;
      /* component normalizer */
      function __vue_normalize__$f(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/card/CardImg.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$f() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$f.styles || (__vue_create_injector__$f.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCardImg = __vue_normalize__$f(
        { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
        __vue_inject_styles__$f,
        __vue_script__$f,
        __vue_scope_id__$f,
        __vue_is_functional_template__$f,
        __vue_module_identifier__$f,
        __vue_create_injector__$f,
        undefined
      );

    var components$6 = {
        dCard: dCard,
        dCardBody: dCardBody,
        dCardFooter: dCardFooter,
        dCardGroup: dCardGroup,
        dCardHeader: dCardHeader,
        dCardImg: dCardImg
    };

    var VuePlugin$6 = {
      install: function install (Vue) {
        registerComponents(Vue, components$6);
      }
    };

    vueUse(VuePlugin$6);

    //

    var script$g = {
        name: 'd-collapse',
        mixins: [ rootListenerMixin ],
        props: {
            /**
             * The component ID.
             */
            id: {
                type: String,
                required: true
            },
            /**
             * The component tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The visibility state.
             */
            visible: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it is located in a nav, or not.
             */
            isNav: {
                type: Boolean,
                default: false
            },
            /**
             * The accordion component identifier (not element ID).
             */
            accordion: {
                type: String,
                default: null
            }
        },
        model: {
            prop: 'visible',
            event: 'input'
        },
        watch: {
            visible: function visible(newVal) {
                if (newVal !== this.show) {
                    this.show = newVal;
                }
            },
            show: function show(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.emitStateChange();
                }
            }
        },
        data: function data() {
            return {
                show: this.visible,
                transitioning: false
            }
        },
        methods: {
            toggle: function toggle() {
                this.show = !this.show;
            },
            emitStateChange: function emitStateChange() {
                this.$emit('input', this.show);
                this.$root.$emit('state', this.id, this.show);

                if (this.accordion && this.show) {
                    /**
                     * Triggered when the accordion is collapsed.
                     *
                     * @event accordion-collapse
                     */
                    this.$root.$emit(COLLAPSE_EVENTS.ACCORDION, this.id, this.accordion);
                }

            },
            handleClick: function handleClick(e) {
                var el = e.target;
                if (!this.isNav || !el || getComputedStyle(this.$el).display !== 'block') {
                    return
                }

                if (hasClass(el, 'nav-link') || hasClass(el, 'dropdown-item')) {
                    this.show = false;
                }
            },
            handleToggleEvent: function handleToggleEvent(e) {
                if (e !== this.id) {
                    return
                }

                this.toggle();
            },
            handleAccordionEvent: function handleAccordionEvent(id, acc) {
                if (!this.accordion || acc !== this.accordion) {
                    return
                }

                if (id === this.id) {
                    if(!this.show) {
                        this.toggle();
                    }
                } else {
                    if(this.show) {
                        this.toggle();
                    }
                }
            },
            handleResize: function handleResize() {
                this.show = (getComputedStyle(this.$el).display === 'block');
            },
            onEnter: function onEnter(el) {
                el.style.height = 0;
                isElement(el) && el.offsetHeight;
                el.style.height = el.scrollHeight + 'px';
                this.transitioning = true;
                /**
                 * Triggered on show.
                 *
                 * @event show
                 */
                this.$emit('show');
            },
            onAfterEnter: function onAfterEnter(el) {
                el.style.height = null;
                this.transitioning = false;
                /**
                 * Triggered after show.
                 *
                 * @event shown
                 */
                this.$emit('shown');
            },
            onLeave: function onLeave(el) {
                el.style.height = 'auto';
                el.style.display = 'block';
                el.style.height = el.getBoundingClientRect().height + 'px';
                isElement(el) && el.offsetHeight;
                this.transitioning = true;
                el.style.height = 0;
                /**
                 * Triggered on hide.
                 *
                 * @event hide
                 */
                this.$emit('hide');
            },
            onAfterLeave: function onAfterLeave(el) {
                el.style.height = null;
                this.transitioning = false;
                /**
                 * Triggered when hidden.
                 *
                 * @event hidden
                 */
                this.$emit('hidden');
            }
        },
        created: function created() {
            this.listenOnRoot(COLLAPSE_EVENTS.TOGGLE, this.handleToggleEvent);
            this.listenOnRoot(COLLAPSE_EVENTS.ACCORDION, this.handleAccordionEvent);
        },
        mounted: function mounted() {
            if (this.isNav && typeof document !== 'undefined') {
                window.addEventListener('resize', this.handleResize, false);
                window.addEventListener('orientationchange', this.handleResize, false);
                this.handleResize();
            }

            this.emitStateChange();
        },
        beforeDestroy: function beforeDestroy() {
            if (this.isNav && typeof document !== 'undefined') {
                window.removeEventListener('resize', this.handleResize, false);
                window.removeEventListener('orientationchange', this.handleResize, false);
            }
        }
    };

    /* script */
                var __vue_script__$g = script$g;
                
    /* template */
    var __vue_render__$g = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "transition",
        {
          attrs: { enterActiveClass: "collapsing", leaveActiveClass: "collapsing" },
          on: {
            enter: _vm.onEnter,
            afterEnter: _vm.onAfterEnter,
            leave: _vm.onLeave,
            afterLeave: _vm.onAfterLeave
          }
        },
        [
          _c(
            _vm.tag,
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.show,
                  expression: "show"
                }
              ],
              tag: "component",
              class: [
                _vm.isNav ? "navbar-collapse" : "",
                !_vm.transitioning ? "collapse" : "",
                _vm.show && !_vm.transitioning ? "show" : ""
              ],
              attrs: { id: [_vm.id ? _vm.id : ""] },
              on: { click: _vm.handleClick }
            },
            [_vm._t("default")],
            2
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$g = [];
    __vue_render__$g._withStripped = true;

      /* style */
      var __vue_inject_styles__$g = undefined;
      /* scoped */
      var __vue_scope_id__$g = undefined;
      /* module identifier */
      var __vue_module_identifier__$g = undefined;
      /* functional template */
      var __vue_is_functional_template__$g = false;
      /* component normalizer */
      function __vue_normalize__$g(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/collapse/Collapse.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$g() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$g.styles || (__vue_create_injector__$g.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCollapse = __vue_normalize__$g(
        { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
        __vue_inject_styles__$g,
        __vue_script__$g,
        __vue_scope_id__$g,
        __vue_is_functional_template__$g,
        __vue_module_identifier__$g,
        __vue_create_injector__$g,
        undefined
      );

    var components$7 = {
        dCollapse: dCollapse
    };

    var VuePlugin$7 = {
      install: function install (Vue) {
        registerComponents(Vue, components$7);
      }
    };

    vueUse(VuePlugin$7);

    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$h = {
        name: 'd-container',
        props: {
            /**
             * Container element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether the container is fluid or not.
             */
            fluid: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$h = script$h;
                
    /* template */
    var __vue_render__$h = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [!_vm.fluid ? "container" : "container-fluid"]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$h = [];
    __vue_render__$h._withStripped = true;

      /* style */
      var __vue_inject_styles__$h = undefined;
      /* scoped */
      var __vue_scope_id__$h = undefined;
      /* module identifier */
      var __vue_module_identifier__$h = undefined;
      /* functional template */
      var __vue_is_functional_template__$h = false;
      /* component normalizer */
      function __vue_normalize__$h(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/container/Container.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$h() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$h.styles || (__vue_create_injector__$h.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dContainer = __vue_normalize__$h(
        { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
        __vue_inject_styles__$h,
        __vue_script__$h,
        __vue_scope_id__$h,
        __vue_is_functional_template__$h,
        __vue_module_identifier__$h,
        __vue_create_injector__$h,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var ALIGNMENT = ['start', 'end', 'center'];

    /**
     * The row subcomponent.
     */
    var script$i = {
        name: 'd-row',
        props: {
            /**
             * Row element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether to remove gutters, or not.
             */
            noGutters: {
                type: Boolean,
                default: false
            },
            /**
             * Align items vertically.
             */
            alignV: {
                type: String,
                default: null,
                validator: function (v) { return ALIGNMENT.concat(['baseline', 'stretch']).includes(v); }
            },
            /**
             * Justify content horizontally.
             */
            alignH: {
                type: String,
                default: null,
                validator: function (v) { return ALIGNMENT.concat(['between', 'around']).includes(v); }
            },
            /**
             * Align content.
             */
            alignContent: {
                type: String,
                default: null,
                validator: function (v) { return ALIGNMENT.concat(['between', 'around', 'stretch']).includes(v); }
            }
        }
    };

    /* script */
                var __vue_script__$i = script$i;
                
    /* template */
    var __vue_render__$i = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          staticClass: "row",
          class: [
            _vm.noGutters ? "no-gutters" : "",
            _vm.alignV ? "align-items-" + _vm.alignV : "",
            _vm.alignH ? "justify-content-" + _vm.alignH : "",
            _vm.alignContent ? "align-content-" + _vm.alignContent : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$i = [];
    __vue_render__$i._withStripped = true;

      /* style */
      var __vue_inject_styles__$i = undefined;
      /* scoped */
      var __vue_scope_id__$i = undefined;
      /* module identifier */
      var __vue_module_identifier__$i = undefined;
      /* functional template */
      var __vue_is_functional_template__$i = false;
      /* component normalizer */
      function __vue_normalize__$i(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/container/Row.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$i() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$i.styles || (__vue_create_injector__$i.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dRow = __vue_normalize__$i(
        { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
        __vue_inject_styles__$i,
        __vue_script__$i,
        __vue_scope_id__$i,
        __vue_is_functional_template__$i,
        __vue_module_identifier__$i,
        __vue_create_injector__$i,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var suffixPropName = function (suffix, str) { return str + (suffix ? upperFirst(suffix) : ''); };
    var upperFirst = function (str) { return String(str).charAt(0).toUpperCase() + String(str).slice(1); };

    // Creates Bootstrap specific breakpoint classes.
    var createBreakpointClass = function (type, breakpoint, val) {
        if (!!val === false) {
            return false
        }

        var className = type;

        if (breakpoint) {
            className += "-" + (breakpoint.replace(type, '')); // -md ?
        }

        if (type === 'col' && (val === '' || val === true)) {
            return className.toLowerCase() // .col-md
        }

        return (className + "-" + val).toLowerCase()
    };

    // Generates component properties.
    function generateProp(type, defaultVal) {
        if ( type === void 0 ) type = [Boolean, String, Number];
        if ( defaultVal === void 0 ) defaultVal = null;

        return {
            default: defaultVal,
            type: type
        }
    }

    // Breakpoints for later use.
    var BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];

    // Generate breakpoint maps.
    var breakpointCol = createBreakpointMap([String, Number, Boolean], false);
    var breakpointOffset = createBreakpointMap([String, Number], null, suffixPropName, 'offset');
    var breakpointOrder = createBreakpointMap([String, Number], null, suffixPropName, 'order');

    // Creates breakpoint maps
    function createBreakpointMap(propGenArgs, defaultValue, breakpointWrapper) {
        if ( propGenArgs === void 0 ) propGenArgs = null;
        if ( breakpointWrapper === void 0 ) breakpointWrapper = null;
        var breakpointWrapperArgs = [], len = arguments.length - 3;
        while ( len-- > 0 ) breakpointWrapperArgs[ len ] = arguments[ len + 3 ];

        breakpointWrapper = breakpointWrapper === null ? function (v) { return v; } : breakpointWrapper;
        return BREAKPOINTS.reduce(function (map, breakpoint) {
            map[breakpointWrapper.apply(void 0, [ breakpoint ].concat( breakpointWrapperArgs ))] = generateProp(propGenArgs, defaultValue);
            return map
        }, {})
    }

    // Define breakpoint props map
    var breakpointPropMap = Object.assign({}, {
        col: Object.keys(breakpointCol),
        offset: Object.keys(breakpointOffset),
        order: Object.keys(breakpointOrder)
    });

    var script$j = {
        name: 'd-col',
        props: Object.assign({},
            breakpointCol,
            breakpointOffset,
            breakpointOrder, {
                /**
                 * The col element tag.
                 */
                tag: {
                    type: String,
                    default: 'div'
                },
                /**
                 * Automatic column.
                 */
                col: {
                    type: Boolean,
                    default: false
                },
                /**
                 * Make the component span a certain no. of columns.
                 */
                cols: generateProp([String, Number]),
                /**
                 * Offset certain no. of columns.
                 */
                offset: generateProp([String, Number]),
                order: generateProp([String, Number]),
                alignSelf: {
                    type: String,
                    default: null,
                    validator: function (v) { return ['auto', 'start', 'end', 'center', 'baseline', 'stretch'].includes(v); }
                }
            }),
        computed: {
            breakpointClasses: function breakpointClasses() {
                var this$1 = this;

                var classList = [];
                for (var type in breakpointPropMap) {
                    var keys = breakpointPropMap[type];
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var breakpointClass = createBreakpointClass(type, key, this$1[key]);

                        if (breakpointClass && classList.indexOf(breakpointClass) === -1) {
                            classList.push(breakpointClass);
                        }
                    }
                }

                return classList
            }
        }
    };

    /* script */
                var __vue_script__$j = script$j;
                
    /* template */
    var __vue_render__$j = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            _vm.breakpointClasses,
            _vm.col || (_vm.breakpointClasses.length === 0 && !_vm.cols)
              ? "col"
              : "",
            _vm.cols ? "col-" + _vm.cols : "",
            _vm.offset ? "offset-" + _vm.offset : "",
            _vm.order ? "order-" + _vm.order : "",
            _vm.alignSelf ? "align-self-" + _vm.alignSelf : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$j = [];
    __vue_render__$j._withStripped = true;

      /* style */
      var __vue_inject_styles__$j = undefined;
      /* scoped */
      var __vue_scope_id__$j = undefined;
      /* module identifier */
      var __vue_module_identifier__$j = undefined;
      /* functional template */
      var __vue_is_functional_template__$j = false;
      /* component normalizer */
      function __vue_normalize__$j(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/container/Col.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$j() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$j.styles || (__vue_create_injector__$j.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dCol = __vue_normalize__$j(
        { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
        __vue_inject_styles__$j,
        __vue_script__$j,
        __vue_scope_id__$j,
        __vue_is_functional_template__$j,
        __vue_module_identifier__$j,
        __vue_create_injector__$j,
        undefined
      );

    var components$8 = {
        dContainer: dContainer,
        dRow: dRow,
        dCol: dCol,
    };

    var VuePlugin$8 = {
      install: function install (Vue) {
        registerComponents(Vue, components$8);
      }
    };

    vueUse(VuePlugin$8);

    //

    // Validator function that checks the date props.
    var _datePropValidator = function (v) {
        return v === null
                || v instanceof Date
                || typeof v === 'string'
                || typeof v === 'number'
    };

    var script$k = {
        name: 'd-datepicker',
        components: { VueDatepicker: VueDatepicker },
        props: {
            /**
             * The datepicker's value.
             */
            value: {
                validator: _datePropValidator
            },
            /**
             * The name.
             */
            name: {
                type: String,
                default: null
            },
            /**
             * The component's ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The date format.
             */
            format: {
                type: [String, Function],
                default: 'dd MMM yyyy'
            },
            /**
             * The language.
             */
            language: Object,
            /**
             * If set, the datepicker will open on this date.
             */
            openDate: {
                validator: _datePropValidator
            },
            /**
             * Function used to render custom content inside the day cell.
             */
            dayCellContent: Function,
            /**
             * Whether to show the full month name, or not.
             */
            fullMonthName: Boolean,
            /**
             * Configure disabled dates.
             */
            disabledDates: Object,
            /**
             * Highlight dates.
             */
            highlighted: Object,
            /**
             * The placeholder.
             */
            placeholder: String,
            /**
             * Show the datepicker always open.
             */
            inline: Boolean,
            /**
             * The CSS class applied to the calendar element.
             */
            calendarClass: {
                type: [String, Object, Array],
                default: ''
            },
            /**
             * The CSS Class applied to the input element.
             */
            inputClass: {
                type: [String, Object, Array],
                default: 'form-control'
            },
            /**
             * The CSS class applied to the wrapper element.
             */
            wrapperClass: [String, Object, Array],
            /**
             * Whether Monday is the first day, or not.
             */
            mondayFirst: Boolean,
            /**
             * Display a button for clearing the dates.
             */
            clearButton: Boolean,
            /**
             * Use an icon for the clear button.
             */
            clearButtonIcon: String,
            /**
             * Dislay a calendar button.
             */
            calendarButton: Boolean,
            /**
             * The calendar button's icon.
             */
            calendarButtonIcon: String,
            /**
             * The calendar button's icon content.
             */
            calendarButtonIconContent: String,
            /**
             * If set, the datepicker is opened on that specific view.
             */
            initialView: String,
            /**
             * The disabled state.
             */
            disabled: Boolean,
            /**
             * The required state.
             */
            required: Boolean,
            /**
             * Whether to allow users to type the date, or not.
             */
            typeable: Boolean,
            /**
             * Use UTC for time calculations.
             */
            useUtc: Boolean,
            /**
             * If set, the lower-level views will not be shown.
             */
            minimumView: {
                type: String,
                default: 'day'
            },
            /**
             * If set, the higher-level views will not be shown.
             */
            maximumView: {
                type: String,
                default: 'year'
            },
            /**
             * Whether the datepicker should be small, or not.
             */
            small: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedCalendarClass: function computedCalendarClass() {
                var _calendarClass = this.small ? 'vdp-datepicker__small' : '';

                return _calendarClass += this.calendarClass
            }
        }
    };

    /* script */
                var __vue_script__$k = script$k;
                
    /* template */
    var __vue_render__$k = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "VueDatepicker",
        _vm._g(
          {
            attrs: {
              value: _vm.value,
              name: _vm.name,
              id: _vm.id,
              format: _vm.format,
              language: _vm.language,
              "open-date": _vm.openDate,
              "day-cell-content": _vm.dayCellContent,
              "full-month-name": _vm.fullMonthName,
              "disabled-dates": _vm.disabledDates,
              highlighted: _vm.highlighted,
              placeholder: _vm.placeholder,
              inline: _vm.inline,
              "calendar-class": _vm.computedCalendarClass,
              "input-class": _vm.inputClass,
              "wrapper-class": _vm.wrapperClass,
              "monday-first": _vm.mondayFirst,
              "clear-button": _vm.clearButton,
              "clear-button-icon": _vm.clearButtonIcon,
              "calendar-button": _vm.calendarButton,
              "calendar-button-icon": _vm.calendarButtonIcon,
              "calendar-button-icon-content": _vm.calendarButtonIconContent,
              "initial-view": _vm.initialView,
              disabled: _vm.disabled,
              required: _vm.required,
              typeable: _vm.typeable,
              "use-utc": _vm.useUtc,
              "minimum-view": _vm.minimumView,
              "maximum-view": _vm.maximumView
            }
          },
          _vm.$listeners
        ),
        [
          _vm._t("beforeCalendarHeader", null, { slot: "beforeCalendarHeader" }),
          _vm._v(" "),
          _vm._t("afterDateInput", null, { slot: "afterDateInput" })
        ],
        2
      )
    };
    var __vue_staticRenderFns__$k = [];
    __vue_render__$k._withStripped = true;

      /* style */
      var __vue_inject_styles__$k = function (inject) {
        if (!inject) { return }
        inject("data-v-6b777267_0", { source: "\ndiv.vdp-datepicker__calendar {\n  color: #5a6169;\n  padding: 20px 22px;\n  min-width: 10rem;\n  font-size: 1rem;\n  font-weight: 300;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  border-radius: 0.375rem;\n  box-shadow: 0 0.5rem 4rem rgba(0, 0, 0, 0.11), 0 10px 20px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.06);\n  border: 1px solid rgba(0, 0, 0, 0.15) !important;\n}\ndiv.vdp-datepicker__calendar header {\n    display: flex;\n    padding-bottom: 10px;\n}\ndiv.vdp-datepicker__calendar header span {\n      transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n      border-radius: 0.375rem;\n      font-weight: 500;\n}\ndiv.vdp-datepicker__calendar header span.next:after {\n        border-left-color: #c3c7cc;\n}\ndiv.vdp-datepicker__calendar header span.prev:after {\n        border-right-color: #c3c7cc;\n}\ndiv.vdp-datepicker__calendar header span:hover,\n  div.vdp-datepicker__calendar .cell.day:not(.disabled):not(.blank):hover, div.vdp-datepicker__calendar .cell.month:hover, div.vdp-datepicker__calendar .cell.year:hover {\n    background-color: #eceeef;\n    border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .cell {\n    line-height: 2;\n    font-size: 1rem;\n    border-radius: 0.375rem;\n    transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n    border-color: transparent;\n    height: auto;\n}\ndiv.vdp-datepicker__calendar .cell.day-header {\n      font-weight: 500;\n}\ndiv.vdp-datepicker__calendar .cell.day {\n      width: 36px;\n      height: 36px;\n      border-radius: 50%;\n}\ndiv.vdp-datepicker__calendar .cell.month, div.vdp-datepicker__calendar .cell.year {\n      height: 36px;\n      font-size: 12px;\n      line-height: 33px;\n}\ndiv.vdp-datepicker__calendar .cell.selected, div.vdp-datepicker__calendar .cell.highlighted.selected {\n      background: #007bff !important;\n      color: #fff;\n}\ndiv.vdp-datepicker__calendar .cell.selected:hover, div.vdp-datepicker__calendar .cell.highlighted.selected:hover {\n        background: #006fe6 !important;\n        border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted {\n      background: #007bff;\n      color: #fff;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted:hover {\n        background: #006fe6 !important;\n        border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted:not(.highlight-start):not(.highlight-end) {\n        border-radius: 0;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted.highlight-start {\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted.highlight-end {\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0;\n}\ndiv.vdp-datepicker__small {\n  padding: 0.625rem 0.625rem;\n  font-size: 0.75rem;\n  max-width: 235px;\n}\ndiv.vdp-datepicker__small .cell.day {\n    width: 1.875rem;\n    height: 1.875rem;\n    line-height: 2.25;\n}\ndiv.vdp-datepicker__small .cell.day, div.vdp-datepicker__small .cell.month, div.vdp-datepicker__small .cell.year {\n    font-size: 12px;\n    font-weight: 500;\n}\ndiv.vdp-datepicker__small .cell.day-header {\n    font-size: 100%;\n}\n\n/*# sourceMappingURL=Datepicker.vue.map */", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/datepicker/Datepicker.vue","Datepicker.vue"],"names":[],"mappings":";AA4PA;EAEA,eA1CA;EA2CA,mBA9BA;EA+BA,iBAnCA;EAoCA,gBAjCA;EAkCA,iBA/BA;EAgCA,kKAzCA;EA0CA,uBArDA;EAsDA,sCArDA;EAsDA,wBA9CA;EA+CA,8GAvDA;EAwDA,iDAAA;CA+FA;AA3GA;IAgBA,cAAA;IACA,qBAAA;CAeA;AAhCA;MAoBA,2DAvDA;MAwDA,wBAzDA;MA0DA,iBAAA;CASA;AA/BA;QAyBA,2BAnEA;CAoEA;AA1BA;QA6BA,4BAvEA;CAwEA;AA9BA;;IAsCA,0BA7EA;IA8EA,qCAAA;CACA;AAxCA;IA6CA,eA7DA;IA8DA,gBA7DA;IA8DA,wBAnFA;IAoFA,2DAnFA;IAoFA,0BAtFA;IAuFA,aAAA;CAwDA;AA1GA;MAsDA,iBAAA;CACA;AAvDA;MA2DA,YA9EA;MA+EA,aA9EA;MA+EA,mBAAA;CACA;AA9DA;MAmEA,aArFA;MAsFA,gBAAA;MACA,kBAAA;CACA;AAtEA;MA2EA,+BAAA;MACA,YAzHA;CA8HA;AAjFA;QA8EA,+BAAA;QACA,qCAAA;CACA;AAhFA;MAoFA,oBA7HA;MA8HA,YAlIA;CAsJA;AAzGA;QAwFA,+BAAA;QACA,qCAAA;CACA;AA1FA;QA6FA,iBAAA;CACA;AA9FA;QAiGA,2BAAA;QACA,8BAAA;CACA;AAnGA;QAsGA,0BAAA;QACA,6BAAA;CACA;AAxGA;EA+GA,2BA3HA;EA4HA,mBA3HA;EA4HA,iBA3HA;CA+IA;AArIA;IAqHA,gBA3HA;IA4HA,iBA3HA;IA4HA,kBA3HA;CA4HA;AAxHA;IA6HA,gBArIA;IAsIA,iBArIA;CAsIA;AA/HA;IAkIA,gBApIA;CAqIA;;AChTA,0CAA0C","file":"Datepicker.vue","sourcesContent":[null,"div.vdp-datepicker__calendar {\n  color: #5a6169;\n  padding: 20px 22px;\n  min-width: 10rem;\n  font-size: 1rem;\n  font-weight: 300;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  border-radius: 0.375rem;\n  box-shadow: 0 0.5rem 4rem rgba(0, 0, 0, 0.11), 0 10px 20px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.06);\n  border: 1px solid rgba(0, 0, 0, 0.15) !important; }\n  div.vdp-datepicker__calendar header {\n    display: flex;\n    padding-bottom: 10px; }\n    div.vdp-datepicker__calendar header span {\n      transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n      border-radius: 0.375rem;\n      font-weight: 500; }\n      div.vdp-datepicker__calendar header span.next:after {\n        border-left-color: #c3c7cc; }\n      div.vdp-datepicker__calendar header span.prev:after {\n        border-right-color: #c3c7cc; }\n  div.vdp-datepicker__calendar header span:hover,\n  div.vdp-datepicker__calendar .cell.day:not(.disabled):not(.blank):hover, div.vdp-datepicker__calendar .cell.month:hover, div.vdp-datepicker__calendar .cell.year:hover {\n    background-color: #eceeef;\n    border-color: transparent !important; }\n  div.vdp-datepicker__calendar .cell {\n    line-height: 2;\n    font-size: 1rem;\n    border-radius: 0.375rem;\n    transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n    border-color: transparent;\n    height: auto; }\n    div.vdp-datepicker__calendar .cell.day-header {\n      font-weight: 500; }\n    div.vdp-datepicker__calendar .cell.day {\n      width: 36px;\n      height: 36px;\n      border-radius: 50%; }\n    div.vdp-datepicker__calendar .cell.month, div.vdp-datepicker__calendar .cell.year {\n      height: 36px;\n      font-size: 12px;\n      line-height: 33px; }\n    div.vdp-datepicker__calendar .cell.selected, div.vdp-datepicker__calendar .cell.highlighted.selected {\n      background: #007bff !important;\n      color: #fff; }\n      div.vdp-datepicker__calendar .cell.selected:hover, div.vdp-datepicker__calendar .cell.highlighted.selected:hover {\n        background: #006fe6 !important;\n        border-color: transparent !important; }\n    div.vdp-datepicker__calendar .cell.highlighted {\n      background: #007bff;\n      color: #fff; }\n      div.vdp-datepicker__calendar .cell.highlighted:hover {\n        background: #006fe6 !important;\n        border-color: transparent !important; }\n      div.vdp-datepicker__calendar .cell.highlighted:not(.highlight-start):not(.highlight-end) {\n        border-radius: 0; }\n      div.vdp-datepicker__calendar .cell.highlighted.highlight-start {\n        border-top-right-radius: 0;\n        border-bottom-right-radius: 0; }\n      div.vdp-datepicker__calendar .cell.highlighted.highlight-end {\n        border-top-left-radius: 0;\n        border-bottom-left-radius: 0; }\n\ndiv.vdp-datepicker__small {\n  padding: 0.625rem 0.625rem;\n  font-size: 0.75rem;\n  max-width: 235px; }\n  div.vdp-datepicker__small .cell.day {\n    width: 1.875rem;\n    height: 1.875rem;\n    line-height: 2.25; }\n  div.vdp-datepicker__small .cell.day, div.vdp-datepicker__small .cell.month, div.vdp-datepicker__small .cell.year {\n    font-size: 12px;\n    font-weight: 500; }\n  div.vdp-datepicker__small .cell.day-header {\n    font-size: 100%; }\n\n/*# sourceMappingURL=Datepicker.vue.map */"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$k = undefined;
      /* module identifier */
      var __vue_module_identifier__$k = undefined;
      /* functional template */
      var __vue_is_functional_template__$k = false;
      /* component normalizer */
      function __vue_normalize__$k(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/datepicker/Datepicker.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$k() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$k.styles || (__vue_create_injector__$k.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dDatepicker = __vue_normalize__$k(
        { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
        __vue_inject_styles__$k,
        __vue_script__$k,
        __vue_scope_id__$k,
        __vue_is_functional_template__$k,
        __vue_module_identifier__$k,
        __vue_create_injector__$k,
        undefined
      );

    var components$9 = {
        dDatepicker: dDatepicker
    };

    var VuePlugin$9 = {
      install: function install (Vue) {
        registerComponents(Vue, components$9);
      }
    };

    vueUse(VuePlugin$9);

    /**!
     * @fileOverview Kickass library to create and place poppers near their reference elements.
     * @version 1.14.4
     * @license
     * Copyright (c) 2016 Federico Zivolo and contributors
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

    var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
    var timeoutDuration = 0;
    for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
      if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
        timeoutDuration = 1;
        break;
      }
    }

    function microtaskDebounce(fn) {
      var called = false;
      return function () {
        if (called) {
          return;
        }
        called = true;
        window.Promise.resolve().then(function () {
          called = false;
          fn();
        });
      };
    }

    function taskDebounce(fn) {
      var scheduled = false;
      return function () {
        if (!scheduled) {
          scheduled = true;
          setTimeout(function () {
            scheduled = false;
            fn();
          }, timeoutDuration);
        }
      };
    }

    var supportsMicroTasks = isBrowser && window.Promise;

    /**
    * Create a debounced version of a method, that's asynchronously deferred
    * but called in the minimum time possible.
    *
    * @method
    * @memberof Popper.Utils
    * @argument {Function} fn
    * @returns {Function}
    */
    var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

    /**
     * Check if the given variable is a function
     * @method
     * @memberof Popper.Utils
     * @argument {Any} functionToCheck - variable to check
     * @returns {Boolean} answer to: is a function?
     */
    function isFunction(functionToCheck) {
      var getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    /**
     * Get CSS computed property of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Eement} element
     * @argument {String} property
     */
    function getStyleComputedProperty(element, property) {
      if (element.nodeType !== 1) {
        return [];
      }
      // NOTE: 1 DOM access here
      var css = getComputedStyle(element, null);
      return property ? css[property] : css;
    }

    /**
     * Returns the parentNode or the host of the element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} parent
     */
    function getParentNode(element) {
      if (element.nodeName === 'HTML') {
        return element;
      }
      return element.parentNode || element.host;
    }

    /**
     * Returns the scrolling parent of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} scroll parent
     */
    function getScrollParent(element) {
      // Return body, `getScroll` will take care to get the correct `scrollTop` from it
      if (!element) {
        return document.body;
      }

      switch (element.nodeName) {
        case 'HTML':
        case 'BODY':
          return element.ownerDocument.body;
        case '#document':
          return element.body;
      }

      // Firefox want us to check `-x` and `-y` variations as well

      var _getStyleComputedProp = getStyleComputedProperty(element),
          overflow = _getStyleComputedProp.overflow,
          overflowX = _getStyleComputedProp.overflowX,
          overflowY = _getStyleComputedProp.overflowY;

      if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
        return element;
      }

      return getScrollParent(getParentNode(element));
    }

    var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
    var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

    /**
     * Determines if the browser is Internet Explorer
     * @method
     * @memberof Popper.Utils
     * @param {Number} version to check
     * @returns {Boolean} isIE
     */
    function isIE(version) {
      if (version === 11) {
        return isIE11;
      }
      if (version === 10) {
        return isIE10;
      }
      return isIE11 || isIE10;
    }

    /**
     * Returns the offset parent of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} offset parent
     */
    function getOffsetParent(element) {
      if (!element) {
        return document.documentElement;
      }

      var noOffsetParent = isIE(10) ? document.body : null;

      // NOTE: 1 DOM access here
      var offsetParent = element.offsetParent;
      // Skip hidden elements which don't have an offsetParent
      while (offsetParent === noOffsetParent && element.nextElementSibling) {
        offsetParent = (element = element.nextElementSibling).offsetParent;
      }

      var nodeName = offsetParent && offsetParent.nodeName;

      if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
        return element ? element.ownerDocument.documentElement : document.documentElement;
      }

      // .offsetParent will return the closest TD or TABLE in case
      // no offsetParent is present, I hate this job...
      if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
        return getOffsetParent(offsetParent);
      }

      return offsetParent;
    }

    function isOffsetContainer(element) {
      var nodeName = element.nodeName;

      if (nodeName === 'BODY') {
        return false;
      }
      return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
    }

    /**
     * Finds the root node (document, shadowDOM root) of the given element
     * @method
     * @memberof Popper.Utils
     * @argument {Element} node
     * @returns {Element} root node
     */
    function getRoot(node) {
      if (node.parentNode !== null) {
        return getRoot(node.parentNode);
      }

      return node;
    }

    /**
     * Finds the offset parent common to the two provided nodes
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element1
     * @argument {Element} element2
     * @returns {Element} common offset parent
     */
    function findCommonOffsetParent(element1, element2) {
      // This check is needed to avoid errors in case one of the elements isn't defined for any reason
      if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
        return document.documentElement;
      }

      // Here we make sure to give as "start" the element that comes first in the DOM
      var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
      var start = order ? element1 : element2;
      var end = order ? element2 : element1;

      // Get common ancestor container
      var range = document.createRange();
      range.setStart(start, 0);
      range.setEnd(end, 0);
      var commonAncestorContainer = range.commonAncestorContainer;

      // Both nodes are inside #document

      if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
        if (isOffsetContainer(commonAncestorContainer)) {
          return commonAncestorContainer;
        }

        return getOffsetParent(commonAncestorContainer);
      }

      // one of the nodes is inside shadowDOM, find which one
      var element1root = getRoot(element1);
      if (element1root.host) {
        return findCommonOffsetParent(element1root.host, element2);
      } else {
        return findCommonOffsetParent(element1, getRoot(element2).host);
      }
    }

    /**
     * Gets the scroll value of the given element in the given side (top and left)
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @argument {String} side `top` or `left`
     * @returns {number} amount of scrolled pixels
     */
    function getScroll(element) {
      var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

      var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
      var nodeName = element.nodeName;

      if (nodeName === 'BODY' || nodeName === 'HTML') {
        var html = element.ownerDocument.documentElement;
        var scrollingElement = element.ownerDocument.scrollingElement || html;
        return scrollingElement[upperSide];
      }

      return element[upperSide];
    }

    /*
     * Sum or subtract the element scroll values (left and top) from a given rect object
     * @method
     * @memberof Popper.Utils
     * @param {Object} rect - Rect object you want to change
     * @param {HTMLElement} element - The element from the function reads the scroll values
     * @param {Boolean} subtract - set to true if you want to subtract the scroll values
     * @return {Object} rect - The modifier rect object
     */
    function includeScroll(rect, element) {
      var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      var modifier = subtract ? -1 : 1;
      rect.top += scrollTop * modifier;
      rect.bottom += scrollTop * modifier;
      rect.left += scrollLeft * modifier;
      rect.right += scrollLeft * modifier;
      return rect;
    }

    /*
     * Helper to detect borders of a given element
     * @method
     * @memberof Popper.Utils
     * @param {CSSStyleDeclaration} styles
     * Result of `getStyleComputedProperty` on the given element
     * @param {String} axis - `x` or `y`
     * @return {number} borders - The borders size of the given axis
     */

    function getBordersSize(styles, axis) {
      var sideA = axis === 'x' ? 'Left' : 'Top';
      var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

      return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
    }

    function getSize(axis, body, html, computedStyle) {
      return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
    }

    function getWindowSizes(document) {
      var body = document.body;
      var html = document.documentElement;
      var computedStyle = isIE(10) && getComputedStyle(html);

      return {
        height: getSize('Height', body, html, computedStyle),
        width: getSize('Width', body, html, computedStyle)
      };
    }

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) { descriptor.writable = true; }
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) { defineProperties(Constructor.prototype, protoProps); }
        if (staticProps) { defineProperties(Constructor, staticProps); }
        return Constructor;
      };
    }();





    var defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var _extends = Object.assign || function (target) {
      var arguments$1 = arguments;

      for (var i = 1; i < arguments.length; i++) {
        var source = arguments$1[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    /**
     * Given element offsets, generate an output similar to getBoundingClientRect
     * @method
     * @memberof Popper.Utils
     * @argument {Object} offsets
     * @returns {Object} ClientRect like output
     */
    function getClientRect(offsets) {
      return _extends({}, offsets, {
        right: offsets.left + offsets.width,
        bottom: offsets.top + offsets.height
      });
    }

    /**
     * Get bounding client rect of given element
     * @method
     * @memberof Popper.Utils
     * @param {HTMLElement} element
     * @return {Object} client rect
     */
    function getBoundingClientRect(element) {
      var rect = {};

      // IE10 10 FIX: Please, don't ask, the element isn't
      // considered in DOM in some circumstances...
      // This isn't reproducible in IE10 compatibility mode of IE11
      try {
        if (isIE(10)) {
          rect = element.getBoundingClientRect();
          var scrollTop = getScroll(element, 'top');
          var scrollLeft = getScroll(element, 'left');
          rect.top += scrollTop;
          rect.left += scrollLeft;
          rect.bottom += scrollTop;
          rect.right += scrollLeft;
        } else {
          rect = element.getBoundingClientRect();
        }
      } catch (e) {}

      var result = {
        left: rect.left,
        top: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };

      // subtract scrollbar size from sizes
      var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
      var width = sizes.width || element.clientWidth || result.right - result.left;
      var height = sizes.height || element.clientHeight || result.bottom - result.top;

      var horizScrollbar = element.offsetWidth - width;
      var vertScrollbar = element.offsetHeight - height;

      // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
      // we make this check conditional for performance reasons
      if (horizScrollbar || vertScrollbar) {
        var styles = getStyleComputedProperty(element);
        horizScrollbar -= getBordersSize(styles, 'x');
        vertScrollbar -= getBordersSize(styles, 'y');

        result.width -= horizScrollbar;
        result.height -= vertScrollbar;
      }

      return getClientRect(result);
    }

    function getOffsetRectRelativeToArbitraryNode(children, parent) {
      var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var isIE10 = isIE(10);
      var isHTML = parent.nodeName === 'HTML';
      var childrenRect = getBoundingClientRect(children);
      var parentRect = getBoundingClientRect(parent);
      var scrollParent = getScrollParent(children);

      var styles = getStyleComputedProperty(parent);
      var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
      var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

      // In cases where the parent is fixed, we must ignore negative scroll in offset calc
      if (fixedPosition && isHTML) {
        parentRect.top = Math.max(parentRect.top, 0);
        parentRect.left = Math.max(parentRect.left, 0);
      }
      var offsets = getClientRect({
        top: childrenRect.top - parentRect.top - borderTopWidth,
        left: childrenRect.left - parentRect.left - borderLeftWidth,
        width: childrenRect.width,
        height: childrenRect.height
      });
      offsets.marginTop = 0;
      offsets.marginLeft = 0;

      // Subtract margins of documentElement in case it's being used as parent
      // we do this only on HTML because it's the only element that behaves
      // differently when margins are applied to it. The margins are included in
      // the box of the documentElement, in the other cases not.
      if (!isIE10 && isHTML) {
        var marginTop = parseFloat(styles.marginTop, 10);
        var marginLeft = parseFloat(styles.marginLeft, 10);

        offsets.top -= borderTopWidth - marginTop;
        offsets.bottom -= borderTopWidth - marginTop;
        offsets.left -= borderLeftWidth - marginLeft;
        offsets.right -= borderLeftWidth - marginLeft;

        // Attach marginTop and marginLeft because in some circumstances we may need them
        offsets.marginTop = marginTop;
        offsets.marginLeft = marginLeft;
      }

      if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
        offsets = includeScroll(offsets, parent);
      }

      return offsets;
    }

    function getViewportOffsetRectRelativeToArtbitraryNode(element) {
      var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var html = element.ownerDocument.documentElement;
      var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
      var width = Math.max(html.clientWidth, window.innerWidth || 0);
      var height = Math.max(html.clientHeight, window.innerHeight || 0);

      var scrollTop = !excludeScroll ? getScroll(html) : 0;
      var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

      var offset = {
        top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
        left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
        width: width,
        height: height
      };

      return getClientRect(offset);
    }

    /**
     * Check if the given element is fixed or is inside a fixed parent
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @argument {Element} customContainer
     * @returns {Boolean} answer to "isFixed?"
     */
    function isFixed(element) {
      var nodeName = element.nodeName;
      if (nodeName === 'BODY' || nodeName === 'HTML') {
        return false;
      }
      if (getStyleComputedProperty(element, 'position') === 'fixed') {
        return true;
      }
      return isFixed(getParentNode(element));
    }

    /**
     * Finds the first parent of an element that has a transformed property defined
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Element} first transformed parent or documentElement
     */

    function getFixedPositionOffsetParent(element) {
      // This check is needed to avoid errors in case one of the elements isn't defined for any reason
      if (!element || !element.parentElement || isIE()) {
        return document.documentElement;
      }
      var el = element.parentElement;
      while (el && getStyleComputedProperty(el, 'transform') === 'none') {
        el = el.parentElement;
      }
      return el || document.documentElement;
    }

    /**
     * Computed the boundaries limits and return them
     * @method
     * @memberof Popper.Utils
     * @param {HTMLElement} popper
     * @param {HTMLElement} reference
     * @param {number} padding
     * @param {HTMLElement} boundariesElement - Element used to define the boundaries
     * @param {Boolean} fixedPosition - Is in fixed position mode
     * @returns {Object} Coordinates of the boundaries
     */
    function getBoundaries(popper, reference, padding, boundariesElement) {
      var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      // NOTE: 1 DOM access here

      var boundaries = { top: 0, left: 0 };
      var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

      // Handle viewport case
      if (boundariesElement === 'viewport') {
        boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
      } else {
        // Handle other cases based on DOM element used as boundaries
        var boundariesNode = void 0;
        if (boundariesElement === 'scrollParent') {
          boundariesNode = getScrollParent(getParentNode(reference));
          if (boundariesNode.nodeName === 'BODY') {
            boundariesNode = popper.ownerDocument.documentElement;
          }
        } else if (boundariesElement === 'window') {
          boundariesNode = popper.ownerDocument.documentElement;
        } else {
          boundariesNode = boundariesElement;
        }

        var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

        // In case of HTML, we need a different computation
        if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
          var _getWindowSizes = getWindowSizes(popper.ownerDocument),
              height = _getWindowSizes.height,
              width = _getWindowSizes.width;

          boundaries.top += offsets.top - offsets.marginTop;
          boundaries.bottom = height + offsets.top;
          boundaries.left += offsets.left - offsets.marginLeft;
          boundaries.right = width + offsets.left;
        } else {
          // for all the other DOM elements, this one is good
          boundaries = offsets;
        }
      }

      // Add paddings
      padding = padding || 0;
      var isPaddingNumber = typeof padding === 'number';
      boundaries.left += isPaddingNumber ? padding : padding.left || 0;
      boundaries.top += isPaddingNumber ? padding : padding.top || 0;
      boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
      boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

      return boundaries;
    }

    function getArea(_ref) {
      var width = _ref.width,
          height = _ref.height;

      return width * height;
    }

    /**
     * Utility used to transform the `auto` placement to the placement with more
     * available space.
     * @method
     * @memberof Popper.Utils
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
      var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

      if (placement.indexOf('auto') === -1) {
        return placement;
      }

      var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

      var rects = {
        top: {
          width: boundaries.width,
          height: refRect.top - boundaries.top
        },
        right: {
          width: boundaries.right - refRect.right,
          height: boundaries.height
        },
        bottom: {
          width: boundaries.width,
          height: boundaries.bottom - refRect.bottom
        },
        left: {
          width: refRect.left - boundaries.left,
          height: boundaries.height
        }
      };

      var sortedAreas = Object.keys(rects).map(function (key) {
        return _extends({
          key: key
        }, rects[key], {
          area: getArea(rects[key])
        });
      }).sort(function (a, b) {
        return b.area - a.area;
      });

      var filteredAreas = sortedAreas.filter(function (_ref2) {
        var width = _ref2.width,
            height = _ref2.height;
        return width >= popper.clientWidth && height >= popper.clientHeight;
      });

      var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

      var variation = placement.split('-')[1];

      return computedPlacement + (variation ? '-' + variation : '');
    }

    /**
     * Get offsets to the reference element
     * @method
     * @memberof Popper.Utils
     * @param {Object} state
     * @param {Element} popper - the popper element
     * @param {Element} reference - the reference element (the popper will be relative to this)
     * @param {Element} fixedPosition - is in fixed position mode
     * @returns {Object} An object containing the offsets which will be applied to the popper
     */
    function getReferenceOffsets(state, popper, reference) {
      var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
      return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
    }

    /**
     * Get the outer sizes of the given element (offset size + margins)
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element
     * @returns {Object} object containing width and height properties
     */
    function getOuterSizes(element) {
      var styles = getComputedStyle(element);
      var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
      var result = {
        width: element.offsetWidth + y,
        height: element.offsetHeight + x
      };
      return result;
    }

    /**
     * Get the opposite placement of the given one
     * @method
     * @memberof Popper.Utils
     * @argument {String} placement
     * @returns {String} flipped placement
     */
    function getOppositePlacement(placement) {
      var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash[matched];
      });
    }

    /**
     * Get offsets to the popper
     * @method
     * @memberof Popper.Utils
     * @param {Object} position - CSS position the Popper will get applied
     * @param {HTMLElement} popper - the popper element
     * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
     * @param {String} placement - one of the valid placement options
     * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
     */
    function getPopperOffsets(popper, referenceOffsets, placement) {
      placement = placement.split('-')[0];

      // Get popper node sizes
      var popperRect = getOuterSizes(popper);

      // Add position, width and height to our offsets object
      var popperOffsets = {
        width: popperRect.width,
        height: popperRect.height
      };

      // depending by the popper placement we have to compute its offsets slightly differently
      var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
      var mainSide = isHoriz ? 'top' : 'left';
      var secondarySide = isHoriz ? 'left' : 'top';
      var measurement = isHoriz ? 'height' : 'width';
      var secondaryMeasurement = !isHoriz ? 'height' : 'width';

      popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
      if (placement === secondarySide) {
        popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
      } else {
        popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
      }

      return popperOffsets;
    }

    /**
     * Mimics the `find` method of Array
     * @method
     * @memberof Popper.Utils
     * @argument {Array} arr
     * @argument prop
     * @argument value
     * @returns index or -1
     */
    function find(arr, check) {
      // use native find if supported
      if (Array.prototype.find) {
        return arr.find(check);
      }

      // use `filter` to obtain the same behavior of `find`
      return arr.filter(check)[0];
    }

    /**
     * Return the index of the matching object
     * @method
     * @memberof Popper.Utils
     * @argument {Array} arr
     * @argument prop
     * @argument value
     * @returns index or -1
     */
    function findIndex(arr, prop, value) {
      // use native findIndex if supported
      if (Array.prototype.findIndex) {
        return arr.findIndex(function (cur) {
          return cur[prop] === value;
        });
      }

      // use `find` + `indexOf` if `findIndex` isn't supported
      var match = find(arr, function (obj) {
        return obj[prop] === value;
      });
      return arr.indexOf(match);
    }

    /**
     * Loop trough the list of modifiers and run them in order,
     * each of them will then edit the data object.
     * @method
     * @memberof Popper.Utils
     * @param {dataObject} data
     * @param {Array} modifiers
     * @param {String} ends - Optional modifier name used as stopper
     * @returns {dataObject}
     */
    function runModifiers(modifiers, data, ends) {
      var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

      modifiersToRun.forEach(function (modifier) {
        if (modifier['function']) {
          // eslint-disable-line dot-notation
          console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
        }
        var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
        if (modifier.enabled && isFunction(fn)) {
          // Add properties to offsets to make them a complete clientRect object
          // we do this before each modifier to make sure the previous one doesn't
          // mess with these values
          data.offsets.popper = getClientRect(data.offsets.popper);
          data.offsets.reference = getClientRect(data.offsets.reference);

          data = fn(data, modifier);
        }
      });

      return data;
    }

    /**
     * Updates the position of the popper, computing the new offsets and applying
     * the new style.<br />
     * Prefer `scheduleUpdate` over `update` because of performance reasons.
     * @method
     * @memberof Popper
     */
    function update() {
      // if popper is destroyed, don't perform any further update
      if (this.state.isDestroyed) {
        return;
      }

      var data = {
        instance: this,
        styles: {},
        arrowStyles: {},
        attributes: {},
        flipped: false,
        offsets: {}
      };

      // compute reference element offsets
      data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

      // compute auto placement, store placement inside the data object,
      // modifiers will be able to edit `placement` if needed
      // and refer to originalPlacement to know the original value
      data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

      // store the computed placement inside `originalPlacement`
      data.originalPlacement = data.placement;

      data.positionFixed = this.options.positionFixed;

      // compute the popper offsets
      data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

      data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

      // run the modifiers
      data = runModifiers(this.modifiers, data);

      // the first `update` will call `onCreate` callback
      // the other ones will call `onUpdate` callback
      if (!this.state.isCreated) {
        this.state.isCreated = true;
        this.options.onCreate(data);
      } else {
        this.options.onUpdate(data);
      }
    }

    /**
     * Helper used to know if the given modifier is enabled.
     * @method
     * @memberof Popper.Utils
     * @returns {Boolean}
     */
    function isModifierEnabled(modifiers, modifierName) {
      return modifiers.some(function (_ref) {
        var name = _ref.name,
            enabled = _ref.enabled;
        return enabled && name === modifierName;
      });
    }

    /**
     * Get the prefixed supported property name
     * @method
     * @memberof Popper.Utils
     * @argument {String} property (camelCase)
     * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
     */
    function getSupportedPropertyName(property) {
      var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
      var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

      for (var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];
        var toCheck = prefix ? '' + prefix + upperProp : property;
        if (typeof document.body.style[toCheck] !== 'undefined') {
          return toCheck;
        }
      }
      return null;
    }

    /**
     * Destroys the popper.
     * @method
     * @memberof Popper
     */
    function destroy() {
      this.state.isDestroyed = true;

      // touch DOM only if `applyStyle` modifier is enabled
      if (isModifierEnabled(this.modifiers, 'applyStyle')) {
        this.popper.removeAttribute('x-placement');
        this.popper.style.position = '';
        this.popper.style.top = '';
        this.popper.style.left = '';
        this.popper.style.right = '';
        this.popper.style.bottom = '';
        this.popper.style.willChange = '';
        this.popper.style[getSupportedPropertyName('transform')] = '';
      }

      this.disableEventListeners();

      // remove the popper if user explicity asked for the deletion on destroy
      // do not use `remove` because IE11 doesn't support it
      if (this.options.removeOnDestroy) {
        this.popper.parentNode.removeChild(this.popper);
      }
      return this;
    }

    /**
     * Get the window associated with the element
     * @argument {Element} element
     * @returns {Window}
     */
    function getWindow(element) {
      var ownerDocument = element.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView : window;
    }

    function attachToScrollParents(scrollParent, event, callback, scrollParents) {
      var isBody = scrollParent.nodeName === 'BODY';
      var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
      target.addEventListener(event, callback, { passive: true });

      if (!isBody) {
        attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
      }
      scrollParents.push(target);
    }

    /**
     * Setup needed event listeners used to update the popper position
     * @method
     * @memberof Popper.Utils
     * @private
     */
    function setupEventListeners(reference, options, state, updateBound) {
      // Resize event listener on window
      state.updateBound = updateBound;
      getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

      // Scroll event listener on scroll parents
      var scrollElement = getScrollParent(reference);
      attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
      state.scrollElement = scrollElement;
      state.eventsEnabled = true;

      return state;
    }

    /**
     * It will add resize/scroll events and start recalculating
     * position of the popper element when they are triggered.
     * @method
     * @memberof Popper
     */
    function enableEventListeners() {
      if (!this.state.eventsEnabled) {
        this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
      }
    }

    /**
     * Remove event listeners used to update the popper position
     * @method
     * @memberof Popper.Utils
     * @private
     */
    function removeEventListeners(reference, state) {
      // Remove resize event listener on window
      getWindow(reference).removeEventListener('resize', state.updateBound);

      // Remove scroll event listener on scroll parents
      state.scrollParents.forEach(function (target) {
        target.removeEventListener('scroll', state.updateBound);
      });

      // Reset state
      state.updateBound = null;
      state.scrollParents = [];
      state.scrollElement = null;
      state.eventsEnabled = false;
      return state;
    }

    /**
     * It will remove resize/scroll events and won't recalculate popper position
     * when they are triggered. It also won't trigger `onUpdate` callback anymore,
     * unless you call `update` method manually.
     * @method
     * @memberof Popper
     */
    function disableEventListeners() {
      if (this.state.eventsEnabled) {
        cancelAnimationFrame(this.scheduleUpdate);
        this.state = removeEventListeners(this.reference, this.state);
      }
    }

    /**
     * Tells if a given input is a number
     * @method
     * @memberof Popper.Utils
     * @param {*} input to check
     * @return {Boolean}
     */
    function isNumeric(n) {
      return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Set the style to the given popper
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element - Element to apply the style to
     * @argument {Object} styles
     * Object with a list of properties and values which will be applied to the element
     */
    function setStyles(element, styles) {
      Object.keys(styles).forEach(function (prop) {
        var unit = '';
        // add unit if the value is numeric and is one of the following
        if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
          unit = 'px';
        }
        element.style[prop] = styles[prop] + unit;
      });
    }

    /**
     * Set the attributes to the given popper
     * @method
     * @memberof Popper.Utils
     * @argument {Element} element - Element to apply the attributes to
     * @argument {Object} styles
     * Object with a list of properties and values which will be applied to the element
     */
    function setAttributes(element, attributes) {
      Object.keys(attributes).forEach(function (prop) {
        var value = attributes[prop];
        if (value !== false) {
          element.setAttribute(prop, attributes[prop]);
        } else {
          element.removeAttribute(prop);
        }
      });
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} data.styles - List of style properties - values to apply to popper element
     * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The same data object
     */
    function applyStyle(data) {
      // any property present in `data.styles` will be applied to the popper,
      // in this way we can make the 3rd party modifiers add custom styles to it
      // Be aware, modifiers could override the properties defined in the previous
      // lines of this modifier!
      setStyles(data.instance.popper, data.styles);

      // any property present in `data.attributes` will be applied to the popper,
      // they will be set as HTML attributes of the element
      setAttributes(data.instance.popper, data.attributes);

      // if arrowElement is defined and arrowStyles has some properties
      if (data.arrowElement && Object.keys(data.arrowStyles).length) {
        setStyles(data.arrowElement, data.arrowStyles);
      }

      return data;
    }

    /**
     * Set the x-placement attribute before everything else because it could be used
     * to add margins to the popper margins needs to be calculated to get the
     * correct popper offsets.
     * @method
     * @memberof Popper.modifiers
     * @param {HTMLElement} reference - The reference element used to position the popper
     * @param {HTMLElement} popper - The HTML element used as popper
     * @param {Object} options - Popper.js options
     */
    function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
      // compute reference element offsets
      var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

      // compute auto placement, store placement inside the data object,
      // modifiers will be able to edit `placement` if needed
      // and refer to originalPlacement to know the original value
      var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

      popper.setAttribute('x-placement', placement);

      // Apply `position` to popper before anything else because
      // without the position applied we can't guarantee correct computations
      setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

      return options;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function computeStyle(data, options) {
      var x = options.x,
          y = options.y;
      var popper = data.offsets.popper;

      // Remove this legacy support in Popper.js v2

      var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
        return modifier.name === 'applyStyle';
      }).gpuAcceleration;
      if (legacyGpuAccelerationOption !== undefined) {
        console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
      }
      var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

      var offsetParent = getOffsetParent(data.instance.popper);
      var offsetParentRect = getBoundingClientRect(offsetParent);

      // Styles
      var styles = {
        position: popper.position
      };

      // Avoid blurry text by using full pixel integers.
      // For pixel-perfect positioning, top/bottom prefers rounded
      // values, while left/right prefers floored values.
      var offsets = {
        left: Math.floor(popper.left),
        top: Math.round(popper.top),
        bottom: Math.round(popper.bottom),
        right: Math.floor(popper.right)
      };

      var sideA = x === 'bottom' ? 'top' : 'bottom';
      var sideB = y === 'right' ? 'left' : 'right';

      // if gpuAcceleration is set to `true` and transform is supported,
      //  we use `translate3d` to apply the position to the popper we
      // automatically use the supported prefixed version if needed
      var prefixedProperty = getSupportedPropertyName('transform');

      // now, let's make a step back and look at this code closely (wtf?)
      // If the content of the popper grows once it's been positioned, it
      // may happen that the popper gets misplaced because of the new content
      // overflowing its reference element
      // To avoid this problem, we provide two options (x and y), which allow
      // the consumer to define the offset origin.
      // If we position a popper on top of a reference element, we can set
      // `x` to `top` to make the popper grow towards its top instead of
      // its bottom.
      var left = void 0,
          top = void 0;
      if (sideA === 'bottom') {
        // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
        // and not the bottom of the html element
        if (offsetParent.nodeName === 'HTML') {
          top = -offsetParent.clientHeight + offsets.bottom;
        } else {
          top = -offsetParentRect.height + offsets.bottom;
        }
      } else {
        top = offsets.top;
      }
      if (sideB === 'right') {
        if (offsetParent.nodeName === 'HTML') {
          left = -offsetParent.clientWidth + offsets.right;
        } else {
          left = -offsetParentRect.width + offsets.right;
        }
      } else {
        left = offsets.left;
      }
      if (gpuAcceleration && prefixedProperty) {
        styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
        styles[sideA] = 0;
        styles[sideB] = 0;
        styles.willChange = 'transform';
      } else {
        // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
        var invertTop = sideA === 'bottom' ? -1 : 1;
        var invertLeft = sideB === 'right' ? -1 : 1;
        styles[sideA] = top * invertTop;
        styles[sideB] = left * invertLeft;
        styles.willChange = sideA + ', ' + sideB;
      }

      // Attributes
      var attributes = {
        'x-placement': data.placement
      };

      // Update `data` attributes, styles and arrowStyles
      data.attributes = _extends({}, attributes, data.attributes);
      data.styles = _extends({}, styles, data.styles);
      data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

      return data;
    }

    /**
     * Helper used to know if the given modifier depends from another one.<br />
     * It checks if the needed modifier is listed and enabled.
     * @method
     * @memberof Popper.Utils
     * @param {Array} modifiers - list of modifiers
     * @param {String} requestingName - name of requesting modifier
     * @param {String} requestedName - name of requested modifier
     * @returns {Boolean}
     */
    function isModifierRequired(modifiers, requestingName, requestedName) {
      var requesting = find(modifiers, function (_ref) {
        var name = _ref.name;
        return name === requestingName;
      });

      var isRequired = !!requesting && modifiers.some(function (modifier) {
        return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
      });

      if (!isRequired) {
        var _requesting = '`' + requestingName + '`';
        var requested = '`' + requestedName + '`';
        console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
      }
      return isRequired;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function arrow(data, options) {
      var _data$offsets$arrow;

      // arrow depends on keepTogether in order to work
      if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
        return data;
      }

      var arrowElement = options.element;

      // if arrowElement is a string, suppose it's a CSS selector
      if (typeof arrowElement === 'string') {
        arrowElement = data.instance.popper.querySelector(arrowElement);

        // if arrowElement is not found, don't run the modifier
        if (!arrowElement) {
          return data;
        }
      } else {
        // if the arrowElement isn't a query selector we must check that the
        // provided DOM node is child of its popper node
        if (!data.instance.popper.contains(arrowElement)) {
          console.warn('WARNING: `arrow.element` must be child of its popper element!');
          return data;
        }
      }

      var placement = data.placement.split('-')[0];
      var _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

      var isVertical = ['left', 'right'].indexOf(placement) !== -1;

      var len = isVertical ? 'height' : 'width';
      var sideCapitalized = isVertical ? 'Top' : 'Left';
      var side = sideCapitalized.toLowerCase();
      var altSide = isVertical ? 'left' : 'top';
      var opSide = isVertical ? 'bottom' : 'right';
      var arrowElementSize = getOuterSizes(arrowElement)[len];

      //
      // extends keepTogether behavior making sure the popper and its
      // reference have enough pixels in conjunction
      //

      // top/left side
      if (reference[opSide] - arrowElementSize < popper[side]) {
        data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
      }
      // bottom/right side
      if (reference[side] + arrowElementSize > popper[opSide]) {
        data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
      }
      data.offsets.popper = getClientRect(data.offsets.popper);

      // compute center of the popper
      var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

      // Compute the sideValue using the updated popper offsets
      // take popper margin in account because we don't have this info available
      var css = getStyleComputedProperty(data.instance.popper);
      var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
      var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
      var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

      // prevent arrowElement from being placed not contiguously to its popper
      sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

      data.arrowElement = arrowElement;
      data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

      return data;
    }

    /**
     * Get the opposite placement variation of the given one
     * @method
     * @memberof Popper.Utils
     * @argument {String} placement variation
     * @returns {String} flipped placement variation
     */
    function getOppositeVariation(variation) {
      if (variation === 'end') {
        return 'start';
      } else if (variation === 'start') {
        return 'end';
      }
      return variation;
    }

    /**
     * List of accepted placements to use as values of the `placement` option.<br />
     * Valid placements are:
     * - `auto`
     * - `top`
     * - `right`
     * - `bottom`
     * - `left`
     *
     * Each placement can have a variation from this list:
     * - `-start`
     * - `-end`
     *
     * Variations are interpreted easily if you think of them as the left to right
     * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
     * is right.<br />
     * Vertically (`left` and `right`), `start` is top and `end` is bottom.
     *
     * Some valid examples are:
     * - `top-end` (on top of reference, right aligned)
     * - `right-start` (on right of reference, top aligned)
     * - `bottom` (on bottom, centered)
     * - `auto-end` (on the side with more space available, alignment depends by placement)
     *
     * @static
     * @type {Array}
     * @enum {String}
     * @readonly
     * @method placements
     * @memberof Popper
     */
    var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

    // Get rid of `auto` `auto-start` and `auto-end`
    var validPlacements = placements.slice(3);

    /**
     * Given an initial placement, returns all the subsequent placements
     * clockwise (or counter-clockwise).
     *
     * @method
     * @memberof Popper.Utils
     * @argument {String} placement - A valid placement (it accepts variations)
     * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
     * @returns {Array} placements including their variations
     */
    function clockwise(placement) {
      var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var index = validPlacements.indexOf(placement);
      var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
      return counter ? arr.reverse() : arr;
    }

    var BEHAVIORS = {
      FLIP: 'flip',
      CLOCKWISE: 'clockwise',
      COUNTERCLOCKWISE: 'counterclockwise'
    };

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function flip(data, options) {
      // if `inner` modifier is enabled, we can't use the `flip` modifier
      if (isModifierEnabled(data.instance.modifiers, 'inner')) {
        return data;
      }

      if (data.flipped && data.placement === data.originalPlacement) {
        // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
        return data;
      }

      var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

      var placement = data.placement.split('-')[0];
      var placementOpposite = getOppositePlacement(placement);
      var variation = data.placement.split('-')[1] || '';

      var flipOrder = [];

      switch (options.behavior) {
        case BEHAVIORS.FLIP:
          flipOrder = [placement, placementOpposite];
          break;
        case BEHAVIORS.CLOCKWISE:
          flipOrder = clockwise(placement);
          break;
        case BEHAVIORS.COUNTERCLOCKWISE:
          flipOrder = clockwise(placement, true);
          break;
        default:
          flipOrder = options.behavior;
      }

      flipOrder.forEach(function (step, index) {
        if (placement !== step || flipOrder.length === index + 1) {
          return data;
        }

        placement = data.placement.split('-')[0];
        placementOpposite = getOppositePlacement(placement);

        var popperOffsets = data.offsets.popper;
        var refOffsets = data.offsets.reference;

        // using floor because the reference offsets may contain decimals we are not going to consider here
        var floor = Math.floor;
        var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

        var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
        var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
        var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
        var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

        var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

        // flip the variation if required
        var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
        var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

        if (overlapsRef || overflowsBoundaries || flippedVariation) {
          // this boolean to detect any flip loop
          data.flipped = true;

          if (overlapsRef || overflowsBoundaries) {
            placement = flipOrder[index + 1];
          }

          if (flippedVariation) {
            variation = getOppositeVariation(variation);
          }

          data.placement = placement + (variation ? '-' + variation : '');

          // this object contains `position`, we want to preserve it along with
          // any additional property we may add in the future
          data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

          data = runModifiers(data.instance.modifiers, data, 'flip');
        }
      });
      return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function keepTogether(data) {
      var _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

      var placement = data.placement.split('-')[0];
      var floor = Math.floor;
      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
      var side = isVertical ? 'right' : 'bottom';
      var opSide = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';

      if (popper[side] < floor(reference[opSide])) {
        data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
      }
      if (popper[opSide] > floor(reference[side])) {
        data.offsets.popper[opSide] = floor(reference[side]);
      }

      return data;
    }

    /**
     * Converts a string containing value + unit into a px value number
     * @function
     * @memberof {modifiers~offset}
     * @private
     * @argument {String} str - Value + unit string
     * @argument {String} measurement - `height` or `width`
     * @argument {Object} popperOffsets
     * @argument {Object} referenceOffsets
     * @returns {Number|String}
     * Value in pixels, or original string if no values were extracted
     */
    function toValue(str, measurement, popperOffsets, referenceOffsets) {
      // separate value from unit
      var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
      var value = +split[1];
      var unit = split[2];

      // If it's not a number it's an operator, I guess
      if (!value) {
        return str;
      }

      if (unit.indexOf('%') === 0) {
        var element = void 0;
        switch (unit) {
          case '%p':
            element = popperOffsets;
            break;
          case '%':
          case '%r':
          default:
            element = referenceOffsets;
        }

        var rect = getClientRect(element);
        return rect[measurement] / 100 * value;
      } else if (unit === 'vh' || unit === 'vw') {
        // if is a vh or vw, we calculate the size based on the viewport
        var size = void 0;
        if (unit === 'vh') {
          size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        } else {
          size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        }
        return size / 100 * value;
      } else {
        // if is an explicit pixel unit, we get rid of the unit and keep the value
        // if is an implicit unit, it's px, and we return just the value
        return value;
      }
    }

    /**
     * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
     * @function
     * @memberof {modifiers~offset}
     * @private
     * @argument {String} offset
     * @argument {Object} popperOffsets
     * @argument {Object} referenceOffsets
     * @argument {String} basePlacement
     * @returns {Array} a two cells array with x and y offsets in numbers
     */
    function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
      var offsets = [0, 0];

      // Use height if placement is left or right and index is 0 otherwise use width
      // in this way the first offset will use an axis and the second one
      // will use the other one
      var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

      // Split the offset string to obtain a list of values and operands
      // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
      var fragments = offset.split(/(\+|\-)/).map(function (frag) {
        return frag.trim();
      });

      // Detect if the offset string contains a pair of values or a single one
      // they could be separated by comma or space
      var divider = fragments.indexOf(find(fragments, function (frag) {
        return frag.search(/,|\s/) !== -1;
      }));

      if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
        console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
      }

      // If divider is found, we divide the list of values and operands to divide
      // them by ofset X and Y.
      var splitRegex = /\s*,\s*|\s+/;
      var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

      // Convert the values with units to absolute pixels to allow our computations
      ops = ops.map(function (op, index) {
        // Most of the units rely on the orientation of the popper
        var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
        var mergeWithPrevious = false;
        return op
        // This aggregates any `+` or `-` sign that aren't considered operators
        // e.g.: 10 + +5 => [10, +, +5]
        .reduce(function (a, b) {
          if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
            a[a.length - 1] = b;
            mergeWithPrevious = true;
            return a;
          } else if (mergeWithPrevious) {
            a[a.length - 1] += b;
            mergeWithPrevious = false;
            return a;
          } else {
            return a.concat(b);
          }
        }, [])
        // Here we convert the string values into number values (in px)
        .map(function (str) {
          return toValue(str, measurement, popperOffsets, referenceOffsets);
        });
      });

      // Loop trough the offsets arrays and execute the operations
      ops.forEach(function (op, index) {
        op.forEach(function (frag, index2) {
          if (isNumeric(frag)) {
            offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
          }
        });
      });
      return offsets;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @argument {Number|String} options.offset=0
     * The offset value as described in the modifier description
     * @returns {Object} The data object, properly modified
     */
    function offset(data, _ref) {
      var offset = _ref.offset;
      var placement = data.placement,
          _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

      var basePlacement = placement.split('-')[0];

      var offsets = void 0;
      if (isNumeric(+offset)) {
        offsets = [+offset, 0];
      } else {
        offsets = parseOffset(offset, popper, reference, basePlacement);
      }

      if (basePlacement === 'left') {
        popper.top += offsets[0];
        popper.left -= offsets[1];
      } else if (basePlacement === 'right') {
        popper.top += offsets[0];
        popper.left += offsets[1];
      } else if (basePlacement === 'top') {
        popper.left += offsets[0];
        popper.top -= offsets[1];
      } else if (basePlacement === 'bottom') {
        popper.left += offsets[0];
        popper.top += offsets[1];
      }

      data.popper = popper;
      return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function preventOverflow(data, options) {
      var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

      // If offsetParent is the reference element, we really want to
      // go one step up and use the next offsetParent as reference to
      // avoid to make this modifier completely useless and look like broken
      if (data.instance.reference === boundariesElement) {
        boundariesElement = getOffsetParent(boundariesElement);
      }

      // NOTE: DOM access here
      // resets the popper's position so that the document size can be calculated excluding
      // the size of the popper element itself
      var transformProp = getSupportedPropertyName('transform');
      var popperStyles = data.instance.popper.style; // assignment to help minification
      var top = popperStyles.top,
          left = popperStyles.left,
          transform = popperStyles[transformProp];

      popperStyles.top = '';
      popperStyles.left = '';
      popperStyles[transformProp] = '';

      var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

      // NOTE: DOM access here
      // restores the original style properties after the offsets have been computed
      popperStyles.top = top;
      popperStyles.left = left;
      popperStyles[transformProp] = transform;

      options.boundaries = boundaries;

      var order = options.priority;
      var popper = data.offsets.popper;

      var check = {
        primary: function primary(placement) {
          var value = popper[placement];
          if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
            value = Math.max(popper[placement], boundaries[placement]);
          }
          return defineProperty({}, placement, value);
        },
        secondary: function secondary(placement) {
          var mainSide = placement === 'right' ? 'left' : 'top';
          var value = popper[mainSide];
          if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
            value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
          }
          return defineProperty({}, mainSide, value);
        }
      };

      order.forEach(function (placement) {
        var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
        popper = _extends({}, popper, check[side](placement));
      });

      data.offsets.popper = popper;

      return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function shift(data) {
      var placement = data.placement;
      var basePlacement = placement.split('-')[0];
      var shiftvariation = placement.split('-')[1];

      // if shift shiftvariation is specified, run the modifier
      if (shiftvariation) {
        var _data$offsets = data.offsets,
            reference = _data$offsets.reference,
            popper = _data$offsets.popper;

        var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
        var side = isVertical ? 'left' : 'top';
        var measurement = isVertical ? 'width' : 'height';

        var shiftOffsets = {
          start: defineProperty({}, side, reference[side]),
          end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
        };

        data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
      }

      return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by update method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function hide(data) {
      if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
        return data;
      }

      var refRect = data.offsets.reference;
      var bound = find(data.instance.modifiers, function (modifier) {
        return modifier.name === 'preventOverflow';
      }).boundaries;

      if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
        // Avoid unnecessary DOM access if visibility hasn't changed
        if (data.hide === true) {
          return data;
        }

        data.hide = true;
        data.attributes['x-out-of-boundaries'] = '';
      } else {
        // Avoid unnecessary DOM access if visibility hasn't changed
        if (data.hide === false) {
          return data;
        }

        data.hide = false;
        data.attributes['x-out-of-boundaries'] = false;
      }

      return data;
    }

    /**
     * @function
     * @memberof Modifiers
     * @argument {Object} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {Object} The data object, properly modified
     */
    function inner(data) {
      var placement = data.placement;
      var basePlacement = placement.split('-')[0];
      var _data$offsets = data.offsets,
          popper = _data$offsets.popper,
          reference = _data$offsets.reference;

      var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

      var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

      popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

      data.placement = getOppositePlacement(placement);
      data.offsets.popper = getClientRect(popper);

      return data;
    }

    /**
     * Modifier function, each modifier can have a function of this type assigned
     * to its `fn` property.<br />
     * These functions will be called on each update, this means that you must
     * make sure they are performant enough to avoid performance bottlenecks.
     *
     * @function ModifierFn
     * @argument {dataObject} data - The data object generated by `update` method
     * @argument {Object} options - Modifiers configuration and options
     * @returns {dataObject} The data object, properly modified
     */

    /**
     * Modifiers are plugins used to alter the behavior of your poppers.<br />
     * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
     * needed by the library.
     *
     * Usually you don't want to override the `order`, `fn` and `onLoad` props.
     * All the other properties are configurations that could be tweaked.
     * @namespace modifiers
     */
    var modifiers = {
      /**
       * Modifier used to shift the popper on the start or end of its reference
       * element.<br />
       * It will read the variation of the `placement` property.<br />
       * It can be one either `-end` or `-start`.
       * @memberof modifiers
       * @inner
       */
      shift: {
        /** @prop {number} order=100 - Index used to define the order of execution */
        order: 100,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: shift
      },

      /**
       * The `offset` modifier can shift your popper on both its axis.
       *
       * It accepts the following units:
       * - `px` or unit-less, interpreted as pixels
       * - `%` or `%r`, percentage relative to the length of the reference element
       * - `%p`, percentage relative to the length of the popper element
       * - `vw`, CSS viewport width unit
       * - `vh`, CSS viewport height unit
       *
       * For length is intended the main axis relative to the placement of the popper.<br />
       * This means that if the placement is `top` or `bottom`, the length will be the
       * `width`. In case of `left` or `right`, it will be the `height`.
       *
       * You can provide a single value (as `Number` or `String`), or a pair of values
       * as `String` divided by a comma or one (or more) white spaces.<br />
       * The latter is a deprecated method because it leads to confusion and will be
       * removed in v2.<br />
       * Additionally, it accepts additions and subtractions between different units.
       * Note that multiplications and divisions aren't supported.
       *
       * Valid examples are:
       * ```
       * 10
       * '10%'
       * '10, 10'
       * '10%, 10'
       * '10 + 10%'
       * '10 - 5vh + 3%'
       * '-10px + 5vh, 5px - 6%'
       * ```
       * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
       * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
       * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
       *
       * @memberof modifiers
       * @inner
       */
      offset: {
        /** @prop {number} order=200 - Index used to define the order of execution */
        order: 200,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: offset,
        /** @prop {Number|String} offset=0
         * The offset value as described in the modifier description
         */
        offset: 0
      },

      /**
       * Modifier used to prevent the popper from being positioned outside the boundary.
       *
       * A scenario exists where the reference itself is not within the boundaries.<br />
       * We can say it has "escaped the boundaries" — or just "escaped".<br />
       * In this case we need to decide whether the popper should either:
       *
       * - detach from the reference and remain "trapped" in the boundaries, or
       * - if it should ignore the boundary and "escape with its reference"
       *
       * When `escapeWithReference` is set to`true` and reference is completely
       * outside its boundaries, the popper will overflow (or completely leave)
       * the boundaries in order to remain attached to the edge of the reference.
       *
       * @memberof modifiers
       * @inner
       */
      preventOverflow: {
        /** @prop {number} order=300 - Index used to define the order of execution */
        order: 300,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: preventOverflow,
        /**
         * @prop {Array} [priority=['left','right','top','bottom']]
         * Popper will try to prevent overflow following these priorities by default,
         * then, it could overflow on the left and on top of the `boundariesElement`
         */
        priority: ['left', 'right', 'top', 'bottom'],
        /**
         * @prop {number} padding=5
         * Amount of pixel used to define a minimum distance between the boundaries
         * and the popper. This makes sure the popper always has a little padding
         * between the edges of its container
         */
        padding: 5,
        /**
         * @prop {String|HTMLElement} boundariesElement='scrollParent'
         * Boundaries used by the modifier. Can be `scrollParent`, `window`,
         * `viewport` or any DOM element.
         */
        boundariesElement: 'scrollParent'
      },

      /**
       * Modifier used to make sure the reference and its popper stay near each other
       * without leaving any gap between the two. Especially useful when the arrow is
       * enabled and you want to ensure that it points to its reference element.
       * It cares only about the first axis. You can still have poppers with margin
       * between the popper and its reference element.
       * @memberof modifiers
       * @inner
       */
      keepTogether: {
        /** @prop {number} order=400 - Index used to define the order of execution */
        order: 400,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: keepTogether
      },

      /**
       * This modifier is used to move the `arrowElement` of the popper to make
       * sure it is positioned between the reference element and its popper element.
       * It will read the outer size of the `arrowElement` node to detect how many
       * pixels of conjunction are needed.
       *
       * It has no effect if no `arrowElement` is provided.
       * @memberof modifiers
       * @inner
       */
      arrow: {
        /** @prop {number} order=500 - Index used to define the order of execution */
        order: 500,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: arrow,
        /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
        element: '[x-arrow]'
      },

      /**
       * Modifier used to flip the popper's placement when it starts to overlap its
       * reference element.
       *
       * Requires the `preventOverflow` modifier before it in order to work.
       *
       * **NOTE:** this modifier will interrupt the current update cycle and will
       * restart it if it detects the need to flip the placement.
       * @memberof modifiers
       * @inner
       */
      flip: {
        /** @prop {number} order=600 - Index used to define the order of execution */
        order: 600,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: flip,
        /**
         * @prop {String|Array} behavior='flip'
         * The behavior used to change the popper's placement. It can be one of
         * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
         * placements (with optional variations)
         */
        behavior: 'flip',
        /**
         * @prop {number} padding=5
         * The popper will flip if it hits the edges of the `boundariesElement`
         */
        padding: 5,
        /**
         * @prop {String|HTMLElement} boundariesElement='viewport'
         * The element which will define the boundaries of the popper position.
         * The popper will never be placed outside of the defined boundaries
         * (except if `keepTogether` is enabled)
         */
        boundariesElement: 'viewport'
      },

      /**
       * Modifier used to make the popper flow toward the inner of the reference element.
       * By default, when this modifier is disabled, the popper will be placed outside
       * the reference element.
       * @memberof modifiers
       * @inner
       */
      inner: {
        /** @prop {number} order=700 - Index used to define the order of execution */
        order: 700,
        /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
        enabled: false,
        /** @prop {ModifierFn} */
        fn: inner
      },

      /**
       * Modifier used to hide the popper when its reference element is outside of the
       * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
       * be used to hide with a CSS selector the popper when its reference is
       * out of boundaries.
       *
       * Requires the `preventOverflow` modifier before it in order to work.
       * @memberof modifiers
       * @inner
       */
      hide: {
        /** @prop {number} order=800 - Index used to define the order of execution */
        order: 800,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: hide
      },

      /**
       * Computes the style that will be applied to the popper element to gets
       * properly positioned.
       *
       * Note that this modifier will not touch the DOM, it just prepares the styles
       * so that `applyStyle` modifier can apply it. This separation is useful
       * in case you need to replace `applyStyle` with a custom implementation.
       *
       * This modifier has `850` as `order` value to maintain backward compatibility
       * with previous versions of Popper.js. Expect the modifiers ordering method
       * to change in future major versions of the library.
       *
       * @memberof modifiers
       * @inner
       */
      computeStyle: {
        /** @prop {number} order=850 - Index used to define the order of execution */
        order: 850,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: computeStyle,
        /**
         * @prop {Boolean} gpuAcceleration=true
         * If true, it uses the CSS 3D transformation to position the popper.
         * Otherwise, it will use the `top` and `left` properties
         */
        gpuAcceleration: true,
        /**
         * @prop {string} [x='bottom']
         * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
         * Change this if your popper should grow in a direction different from `bottom`
         */
        x: 'bottom',
        /**
         * @prop {string} [x='left']
         * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
         * Change this if your popper should grow in a direction different from `right`
         */
        y: 'right'
      },

      /**
       * Applies the computed styles to the popper element.
       *
       * All the DOM manipulations are limited to this modifier. This is useful in case
       * you want to integrate Popper.js inside a framework or view library and you
       * want to delegate all the DOM manipulations to it.
       *
       * Note that if you disable this modifier, you must make sure the popper element
       * has its position set to `absolute` before Popper.js can do its work!
       *
       * Just disable this modifier and define your own to achieve the desired effect.
       *
       * @memberof modifiers
       * @inner
       */
      applyStyle: {
        /** @prop {number} order=900 - Index used to define the order of execution */
        order: 900,
        /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
        enabled: true,
        /** @prop {ModifierFn} */
        fn: applyStyle,
        /** @prop {Function} */
        onLoad: applyStyleOnLoad,
        /**
         * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
         * @prop {Boolean} gpuAcceleration=true
         * If true, it uses the CSS 3D transformation to position the popper.
         * Otherwise, it will use the `top` and `left` properties
         */
        gpuAcceleration: undefined
      }
    };

    /**
     * The `dataObject` is an object containing all the information used by Popper.js.
     * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
     * @name dataObject
     * @property {Object} data.instance The Popper.js instance
     * @property {String} data.placement Placement applied to popper
     * @property {String} data.originalPlacement Placement originally defined on init
     * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
     * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
     * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
     * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
     * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
     * @property {Object} data.boundaries Offsets of the popper boundaries
     * @property {Object} data.offsets The measurements of popper, reference and arrow elements
     * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
     * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
     * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
     */

    /**
     * Default options provided to Popper.js constructor.<br />
     * These can be overridden using the `options` argument of Popper.js.<br />
     * To override an option, simply pass an object with the same
     * structure of the `options` object, as the 3rd argument. For example:
     * ```
     * new Popper(ref, pop, {
     *   modifiers: {
     *     preventOverflow: { enabled: false }
     *   }
     * })
     * ```
     * @type {Object}
     * @static
     * @memberof Popper
     */
    var Defaults = {
      /**
       * Popper's placement.
       * @prop {Popper.placements} placement='bottom'
       */
      placement: 'bottom',

      /**
       * Set this to true if you want popper to position it self in 'fixed' mode
       * @prop {Boolean} positionFixed=false
       */
      positionFixed: false,

      /**
       * Whether events (resize, scroll) are initially enabled.
       * @prop {Boolean} eventsEnabled=true
       */
      eventsEnabled: true,

      /**
       * Set to true if you want to automatically remove the popper when
       * you call the `destroy` method.
       * @prop {Boolean} removeOnDestroy=false
       */
      removeOnDestroy: false,

      /**
       * Callback called when the popper is created.<br />
       * By default, it is set to no-op.<br />
       * Access Popper.js instance with `data.instance`.
       * @prop {onCreate}
       */
      onCreate: function onCreate() {},

      /**
       * Callback called when the popper is updated. This callback is not called
       * on the initialization/creation of the popper, but only on subsequent
       * updates.<br />
       * By default, it is set to no-op.<br />
       * Access Popper.js instance with `data.instance`.
       * @prop {onUpdate}
       */
      onUpdate: function onUpdate() {},

      /**
       * List of modifiers used to modify the offsets before they are applied to the popper.
       * They provide most of the functionalities of Popper.js.
       * @prop {modifiers}
       */
      modifiers: modifiers
    };

    /**
     * @callback onCreate
     * @param {dataObject} data
     */

    /**
     * @callback onUpdate
     * @param {dataObject} data
     */

    // Utils
    // Methods
    var Popper = function () {
      /**
       * Creates a new Popper.js instance.
       * @class Popper
       * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
       * @param {HTMLElement} popper - The HTML element used as the popper
       * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
       * @return {Object} instance - The generated Popper.js instance
       */
      function Popper(reference, popper) {
        var _this = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, Popper);

        this.scheduleUpdate = function () {
          return requestAnimationFrame(_this.update);
        };

        // make update() debounced, so that it only runs at most once-per-tick
        this.update = debounce(this.update.bind(this));

        // with {} we create a new object with the options inside it
        this.options = _extends({}, Popper.Defaults, options);

        // init state
        this.state = {
          isDestroyed: false,
          isCreated: false,
          scrollParents: []
        };

        // get reference and popper elements (allow jQuery wrappers)
        this.reference = reference && reference.jquery ? reference[0] : reference;
        this.popper = popper && popper.jquery ? popper[0] : popper;

        // Deep merge modifiers options
        this.options.modifiers = {};
        Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
          _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
        });

        // Refactoring modifiers' list (Object => Array)
        this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
          return _extends({
            name: name
          }, _this.options.modifiers[name]);
        })
        // sort the modifiers by order
        .sort(function (a, b) {
          return a.order - b.order;
        });

        // modifiers have the ability to execute arbitrary code when Popper.js get inited
        // such code is executed in the same order of its modifier
        // they could add new properties to their options configuration
        // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
        this.modifiers.forEach(function (modifierOptions) {
          if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
            modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
          }
        });

        // fire the first update to position the popper in the right place
        this.update();

        var eventsEnabled = this.options.eventsEnabled;
        if (eventsEnabled) {
          // setup event listeners, they will take care of update the position in specific situations
          this.enableEventListeners();
        }

        this.state.eventsEnabled = eventsEnabled;
      }

      // We can't use class properties because they don't get listed in the
      // class prototype and break stuff like Sinon stubs


      createClass(Popper, [{
        key: 'update',
        value: function update$$1() {
          return update.call(this);
        }
      }, {
        key: 'destroy',
        value: function destroy$$1() {
          return destroy.call(this);
        }
      }, {
        key: 'enableEventListeners',
        value: function enableEventListeners$$1() {
          return enableEventListeners.call(this);
        }
      }, {
        key: 'disableEventListeners',
        value: function disableEventListeners$$1() {
          return disableEventListeners.call(this);
        }

        /**
         * Schedules an update. It will run on the next UI update available.
         * @method scheduleUpdate
         * @memberof Popper
         */


        /**
         * Collection of utilities useful when writing custom modifiers.
         * Starting from version 1.7, this method is available only if you
         * include `popper-utils.js` before `popper.js`.
         *
         * **DEPRECATION**: This way to access PopperUtils is deprecated
         * and will be removed in v2! Use the PopperUtils module directly instead.
         * Due to the high instability of the methods contained in Utils, we can't
         * guarantee them to follow semver. Use them at your own risk!
         * @static
         * @private
         * @type {Object}
         * @deprecated since version 1.8
         * @member Utils
         * @memberof Popper
         */

      }]);
      return Popper;
    }();

    /**
     * The `referenceObject` is an object that provides an interface compatible with Popper.js
     * and lets you use it as replacement of a real DOM node.<br />
     * You can use this method to position a popper relatively to a set of coordinates
     * in case you don't have a DOM node to use as reference.
     *
     * ```
     * new Popper(referenceObject, popperNode);
     * ```
     *
     * NB: This feature isn't supported in Internet Explorer 10.
     * @name referenceObject
     * @property {Function} data.getBoundingClientRect
     * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
     * @property {number} data.clientWidth
     * An ES6 getter that will return the width of the virtual reference element.
     * @property {number} data.clientHeight
     * An ES6 getter that will return the height of the virtual reference element.
     */


    Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
    Popper.placements = placements;
    Popper.Defaults = Defaults;

    // Creates the cancelable event props.
    function _makeCancelableEventProps() {
        return { enumerable: true, configurable: false, writable: false }
    }

    /**
     * Custom cancelable event.
     */
    var CancelableEvent = function CancelableEvent (type, eventInit) {
        if ( eventInit === void 0 ) eventInit = {};

        Object.assign(this, CancelableEvent.defaults(), eventInit, { type: type });

        Object.defineProperties(this, {
            type: _makeCancelableEventProps(),
            cancelable: _makeCancelableEventProps(),
            nativeEvent: _makeCancelableEventProps(),
            target: _makeCancelableEventProps(),
            relatedTarget: _makeCancelableEventProps(),
            vueTarget: _makeCancelableEventProps()
        });

        var defaultPrevented = false;

        this.preventDefault = function preventDefault() {
            if (this.cancelable) {
                defaultPrevented = true;
            }
        };

        Object.defineProperty(this, 'defaultPrevented', {
            enumerable: true,
            get: function get() {
                return defaultPrevented
            }
        });
    };

    CancelableEvent.defaults = function defaults () {
        return {
            type: '',
            cancelable: true,
            nativeEvent: null,
            target: null,
            relatedTarget: null,
            vueTarget: null
        }
    };

    //

    var script$l = {
        name: 'd-dropdown',
        mixins: [
            rootListenerMixin,
            vueClickaway.mixin
        ],
        data: function data() {
            return {
                visible: false,
                isNavbar: null,
                visibleChangePrevented: false
            }
        },
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The dropdown menu ID.
             */
            menuId: {
                type: String,
                default: null
            },
            /**
             * The toggle ID.
             */
            toggleId: {
                type: String,
                default: null
            },
            /**
             * The dropdown menu class(es).
             */
            menuClass: {
                type: [String, Array],
                default: null
            },
            /**
             * The dropdown toggle class(es).
             */
            toggleClass: {
                type: [String, Array],
                default: null
            },
            /**
             * Align the menu to the right.
             */
            right: {
                type: Boolean,
                default: false
            },
            /**
             * Whether to display the caret, or not.
             */
            noCaret: {
                type: Boolean,
                default: false
            },
            /**
             * Whether to split the dropdown, or not.
             */
            split: {
                type: Boolean,
                default: false
            },
            /**
             * The color theme.
             */
            theme: {
                type: String,
                default: 'primary',
                validator: function (v) { return THEMECOLORS.includes(v); }
            },
            /**
             * The dropdown toggle's size.
             */
            size: {
                type: String,
                default: null
            },
            /**
             * The dropdown's disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * The dropdown toggle's text.
             */
            toggleText: {
                type: String,
                default: 'Toggle Dropdown'
            },
            /**
             * The button label's text.
             */
            text: {
                type: String,
                default: ''
            },
            /**
             * The dropdown's boundary.
             */
            boundary: {
                type: String,
                default: 'scrollParent',
                validator: function (v) { return ['scrollParent', 'window', 'viewport'].includes(v); }
            },
            /**
             * The offset value.
             */
            offset: {
                type: [Number, String],
                default: null
            },
            /**
             * Display on top.
             */
            dropup: {
                type: Boolean,
                default: false
            },
            /**
             * The Popper options.
             */
            popperOptions: {
                type: Object,
                default: function default$1() {
                    return {}
                }
            },
            /**
             * Disable autoflipping.
             */
            noFlip: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the dropdown is displayed inside a nav, or not.
             */
            isNav: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            visible: function visible(newVal, oldVal) {
                if (this.visibleChangePrevented) {
                    this.visibleChangePrevented = false;
                    return
                }

                if (newVal === oldVal) {
                    return
                }

                var eventName = newVal ? 'show' : 'hide';
                var _visibleChangeEvent = new CancelableEvent(eventName, {
                    cancelable: true,
                    vueTarget: this,
                    target: this.$refs.menu,
                    relatedTarget: null
                });

                this.$emit(_visibleChangeEvent.type, _visibleChangeEvent);
                this.emitOnRoot(DROPDOWN_EVENTS[_visibleChangeEvent.type.toUpperCase()]);

                if (_visibleChangeEvent.defaultPrevented) {
                    this.visibleChangePrevented = true;
                    this.visible = oldVal;
                    return
                }

                if (eventName === 'show') {
                    this.showMenu();
                    return
                }

                this.hideMenu();
            },
            disabled: function disabled(newVal, oldVal) {
                if (newVal !== oldVal && newVal && this.visible) {
                    this.visible = false;
                }
            }
        },
        computed: {
            computedTag: function computedTag() {
                return this.isNav ? 'li' : 'div'
            },
            computedToggleTag: function computedToggleTag() {
                return this.isNav ? 'a' : 'd-button'
            },
            computedID: function computedID() {
                return this.id || ("d-dropdown-" + (guid()))
            },
            computedMenuID: function computedMenuID() {
                return this.menuId || ("d-dropdown-menu-" + (guid()))
            },
            computedToggleID: function computedToggleID() {
                return this.toggleId || ("d-dropdown-toggle-" + (guid()))
            },
            computedSplitID: function computedSplitID() {
                return this.splitId || ("d-dropdown-split-" + (guid()))
            },
            toggler: function toggler() {
                return this.$refs.toggle.$el || this.$refs.toggle
            }
        },
        methods: {
            onMouseOver: function onMouseOver(event) {
                var item = event.target;
                if (
                    item.classList.contains('dropdown-item')
                    && !item.disabled
                    && !item.classList.contains('disabled')
                    && item.focus
                ) {
                    item.focus();
                }
            },
            toggle: function toggle(event) {
                event = event || {};

                // Enter, Space or Down
                var KEY_ESD = event.keyCode === KEYCODES.ENTER
                                || event.keyCode === KEYCODES.SPACE
                                || event.keyCode === KEYCODES.DOWN;

                if (event.type !== 'click' && !(event.type === 'keydown' && KEY_ESD)) {
                    return
                }

                if (this.disabled) {
                    this.visible = false;
                    return
                }

                this.$emit('toggle', event);

                if (event.defaultPrevented) {
                    return
                }

                event.preventDefault();
                event.stopPropagation();

                this.visible = !this.visible;
            },
            click: function click(event) {
                if (this.disabled) {
                    this.visible = false;
                    return
                }
                this.$emit('click', event);
            },
            createPopper: function createPopper(element) {
                this.removePopper();

                // Define placement
                var placement = 'bottom-start';

                if (this.dropup && this.right) {
                    placement = 'top-end';
                } else if (this.dropup) {
                    placement = 'top-start';
                } else if (this.right) {
                    placement = 'bottom-end';
                }

                // Build Popper config
                var popperConfig = {
                    placement: placement,
                    modifiers: {
                        offset: {
                            offset: this.offset || 0
                        },
                        flip: {
                            enabled: !this.noFlip
                        },
                        computeStyle: {
                            enabled: true
                        }
                    }
                };

                // Define Popper boundaries
                if (this.boundary) {
                    popperConfig.modifiers.preventOverflow = {
                        boundariesElement: this.boundary
                    };
                }

                // Create Popper instance
                this._popperInstance = new Popper(
                    element,
                    this.$refs.menu,
                    Object.assign({}, popperConfig,
                        this.popperOptions)
                );
            },
            removePopper: function removePopper() {
                if (this._popper) {
                    this._popper.destroy();
                }
                this._popperInstance = null;
            },
            showMenu: function showMenu() {
                if (this.disabled) {
                    return
                }

                this.emitOnRoot(DROPDOWN_EVENTS.SHOWN, this);

                if (this.inNavbar === null && this.isNav) {
                    this.inNavbar = Boolean(closest('.navbar', this.$el));
                }

                if (!this.inNavbar) {
                    var _element = ((this.dropup && this.right) || this.split) ? this.$el : this.$refs.toggle;
                    _element = _element.$el || _element;
                    this.createPopper(_element);
                }

                this.$emit('shown');
                this.$nextTick(this.focusFirstItem);
            },
            hideMenu: function hideMenu() {
                this.emitOnRoot(DROPDOWN_EVENTS.HIDDEN, this);
                this.$emit('hidden');
                this.removePopper();
            },
            away: function away() {
                this.visible = false;
            }
        },
        created: function created() {
            this._popperInstance = null;
        },
        mounted: function mounted() {
            this.listenOnRoot(DROPDOWN_EVENTS.SHOWN, function(vm) {
                if (vm !== this) {
                    this.visible = false;
                }
            });

            this.listenOnRoot(LINK_EVENTS.CLICKED, this.away);
        },
        deactivated: function deactivated() {
            this.visible = false;
            this.removePopper();
        },
        beforeDestroy: function beforeDestroy() {
            this.visible = false;
            this.removePopper();
        }
    };

    /* script */
                var __vue_script__$l = script$l;
                
    /* template */
    var __vue_render__$l = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.computedTag,
        {
          directives: [
            {
              name: "on-clickaway",
              rawName: "v-on-clickaway",
              value: _vm.away,
              expression: "away"
            }
          ],
          tag: "component",
          class: [
            "dropdown",
            "d-dropdown",
            !_vm.isNav ? "btn-group" : "",
            _vm.isNav ? "nav-item" : "",
            _vm.dropup ? "dropup" : "",
            _vm.visible ? "show" : "",
            _vm.boundary !== "scrollParent" || !_vm.boundary
              ? "position-static"
              : ""
          ],
          attrs: { id: _vm.computedID }
        },
        [
          _vm.split && !_vm.isNav
            ? _c(
                "d-button",
                {
                  ref: "button",
                  attrs: {
                    disabled: _vm.disabled,
                    theme: _vm.theme,
                    size: _vm.size,
                    id: _vm.computedSplitID
                  },
                  on: { click: _vm.click }
                },
                [_vm._t("button-content", [_vm._v(_vm._s(_vm.text))])],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            _vm.computedToggleTag,
            {
              ref: "toggle",
              tag: "component",
              class: [
                _vm.isNav ? "nav-link" : "",
                !_vm.noCaret || _vm.split ? "dropdown-toggle" : "",
                _vm.split && !_vm.isNav ? "dropdown-toggle-split" : "",
                _vm.toggleClass
              ],
              attrs: {
                id: _vm.computedToggleID,
                theme: _vm.theme,
                size: _vm.size,
                disabled: _vm.disabled,
                "aria-expanded": _vm.visible ? "true" : "false",
                "aria-haspopup": "true"
              },
              on: { click: _vm.toggle, keydown: _vm.toggle }
            },
            [
              _vm.split
                ? _c("span", { staticClass: "sr-only" }, [
                    _vm._v(_vm._s(_vm.toggleText))
                  ])
                : _vm._t("button-content", [_vm._v(_vm._s(_vm.text))])
            ],
            2
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              ref: "menu",
              class: [
                "dropdown-menu",
                _vm.right ? "dropdown-menu-right" : "",
                _vm.visible ? "show" : "",
                _vm.menuClass
              ],
              attrs: {
                role: "menu",
                id: _vm.computedMenuID,
                "aria-labeledby": _vm.computedMenuID
              },
              on: { mouseover: _vm.onMouseOver }
            },
            [_vm._t("default")],
            2
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$l = [];
    __vue_render__$l._withStripped = true;

      /* style */
      var __vue_inject_styles__$l = function (inject) {
        if (!inject) { return }
        inject("data-v-68c0b8ac_0", { source: "\n.nav-link[data-v-68c0b8ac]:hover {\n    cursor: pointer;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/dropdown/Dropdown.vue"],"names":[],"mappings":";AAsbA;IACA,gBAAA;CACA","file":"Dropdown.vue","sourcesContent":["<template>\n    <component :is=\"computedTag\" :id=\"computedID\"\n        v-on-clickaway=\"away\"\n        :class=\"[\n            'dropdown',\n            'd-dropdown',\n            !isNav ? 'btn-group' : '',\n            isNav ? 'nav-item' : '',\n            dropup ? 'dropup' : '',\n            visible ? 'show' : '',\n            (boundary !== 'scrollParent' || !boundary) ? 'position-static' : ''\n        ]\">\n\n        <!-- Dropdown Split -->\n        <d-button v-if=\"split && !isNav\"\n            ref=\"button\"\n            :disabled=\"disabled\"\n            :theme=\"theme\"\n            :size=\"size\"\n            :id=\"computedSplitID\"\n            @click=\"click\">\n            <slot name=\"button-content\">{{ text }}</slot>\n        </d-button>\n\n        <!-- Dropdown Toggle -->\n        <component :is=\"computedToggleTag\" ref=\"toggle\"\n            :id=\"computedToggleID\"\n            :class=\"[\n                isNav ? 'nav-link' : '',\n                !noCaret || split ? 'dropdown-toggle' : '',\n                split && !isNav ? 'dropdown-toggle-split' : '',\n                toggleClass\n            ]\"\n            :theme=\"theme\"\n            :size=\"size\"\n            :disabled=\"disabled\"\n            :aria-expanded=\"visible ? 'true' : 'false'\"\n            aria-haspopup=\"true\"\n            @click=\"toggle\"\n            @keydown=\"toggle\">\n            <span v-if=\"split\" class=\"sr-only\">{{ toggleText }}</span>\n            <slot v-else name=\"button-content\">{{ text }}</slot>\n        </component>\n\n        <!-- Dropdown Menu -->\n        <div ref=\"menu\"\n            role=\"menu\"\n            :class=\"[\n                'dropdown-menu',\n                right ? 'dropdown-menu-right' : '',\n                visible ? 'show' : '',\n                menuClass\n            ]\"\n            :id=\"computedMenuID\"\n            :aria-labeledby=\"computedMenuID\"\n            @mouseover=\"onMouseOver\">\n            <slot />\n        </div>\n    </component>\n</template>\n\n<script>\nimport Popper from 'popper.js'\nimport { guid, closest } from '../../utils'\nimport { THEMECOLORS, DROPDOWN_EVENTS, KEYCODES, LINK_EVENTS } from '../../utils/constants'\nimport { CancelableEvent } from '../../utils/events'\nimport { mixin as clickAwayMixin } from 'vue-clickaway';\nimport rootListenerMixin from '../../mixins/root-listener.mixin'\n\nexport default {\n    name: 'd-dropdown',\n    mixins: [\n        rootListenerMixin,\n        clickAwayMixin\n    ],\n    data() {\n        return {\n            visible: false,\n            isNavbar: null,\n            visibleChangePrevented: false\n        }\n    },\n    props: {\n        /**\n         * The element ID.\n         */\n        id: {\n            type: String,\n            default: null\n        },\n        /**\n         * The dropdown menu ID.\n         */\n        menuId: {\n            type: String,\n            default: null\n        },\n        /**\n         * The toggle ID.\n         */\n        toggleId: {\n            type: String,\n            default: null\n        },\n        /**\n         * The dropdown menu class(es).\n         */\n        menuClass: {\n            type: [String, Array],\n            default: null\n        },\n        /**\n         * The dropdown toggle class(es).\n         */\n        toggleClass: {\n            type: [String, Array],\n            default: null\n        },\n        /**\n         * Align the menu to the right.\n         */\n        right: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether to display the caret, or not.\n         */\n        noCaret: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether to split the dropdown, or not.\n         */\n        split: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The color theme.\n         */\n        theme: {\n            type: String,\n            default: 'primary',\n            validator: v => THEMECOLORS.includes(v)\n        },\n        /**\n         * The dropdown toggle's size.\n         */\n        size: {\n            type: String,\n            default: null\n        },\n        /**\n         * The dropdown's disabled state.\n         */\n        disabled: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The dropdown toggle's text.\n         */\n        toggleText: {\n            type: String,\n            default: 'Toggle Dropdown'\n        },\n        /**\n         * The button label's text.\n         */\n        text: {\n            type: String,\n            default: ''\n        },\n        /**\n         * The dropdown's boundary.\n         */\n        boundary: {\n            type: String,\n            default: 'scrollParent',\n            validator: v => ['scrollParent', 'window', 'viewport'].includes(v)\n        },\n        /**\n         * The offset value.\n         */\n        offset: {\n            type: [Number, String],\n            default: null\n        },\n        /**\n         * Display on top.\n         */\n        dropup: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The Popper options.\n         */\n        popperOptions: {\n            type: Object,\n            default() {\n                return {}\n            }\n        },\n        /**\n         * Disable autoflipping.\n         */\n        noFlip: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether the dropdown is displayed inside a nav, or not.\n         */\n        isNav: {\n            type: Boolean,\n            default: false\n        }\n    },\n    watch: {\n        visible(newVal, oldVal) {\n            if (this.visibleChangePrevented) {\n                this.visibleChangePrevented = false\n                return\n            }\n\n            if (newVal === oldVal) {\n                return\n            }\n\n            const eventName = newVal ? 'show' : 'hide'\n            let _visibleChangeEvent = new CancelableEvent(eventName, {\n                cancelable: true,\n                vueTarget: this,\n                target: this.$refs.menu,\n                relatedTarget: null\n            })\n\n            this.$emit(_visibleChangeEvent.type, _visibleChangeEvent)\n            this.emitOnRoot(DROPDOWN_EVENTS[_visibleChangeEvent.type.toUpperCase()])\n\n            if (_visibleChangeEvent.defaultPrevented) {\n                this.visibleChangePrevented = true\n                this.visible = oldVal\n                return\n            }\n\n            if (eventName === 'show') {\n                this.showMenu()\n                return\n            }\n\n            this.hideMenu()\n        },\n        disabled(newVal, oldVal) {\n            if (newVal !== oldVal && newVal && this.visible) {\n                this.visible = false\n            }\n        }\n    },\n    computed: {\n        computedTag() {\n            return this.isNav ? 'li' : 'div'\n        },\n        computedToggleTag() {\n            return this.isNav ? 'a' : 'd-button'\n        },\n        computedID() {\n            return this.id || `d-dropdown-${guid()}`\n        },\n        computedMenuID() {\n            return this.menuId || `d-dropdown-menu-${guid()}`\n        },\n        computedToggleID() {\n            return this.toggleId || `d-dropdown-toggle-${guid()}`\n        },\n        computedSplitID() {\n            return this.splitId || `d-dropdown-split-${guid()}`\n        },\n        toggler() {\n            return this.$refs.toggle.$el || this.$refs.toggle\n        }\n    },\n    methods: {\n        onMouseOver(event) {\n            const item = event.target\n            if (\n                item.classList.contains('dropdown-item')\n                && !item.disabled\n                && !item.classList.contains('disabled')\n                && item.focus\n            ) {\n                item.focus()\n            }\n        },\n        toggle(event) {\n            event = event || {}\n\n            // Enter, Space or Down\n            const KEY_ESD = event.keyCode === KEYCODES.ENTER\n                            || event.keyCode === KEYCODES.SPACE\n                            || event.keyCode === KEYCODES.DOWN\n\n            if (event.type !== 'click' && !(event.type === 'keydown' && KEY_ESD)) {\n                return\n            }\n\n            if (this.disabled) {\n                this.visible = false\n                return\n            }\n\n            this.$emit('toggle', event)\n\n            if (event.defaultPrevented) {\n                return\n            }\n\n            event.preventDefault()\n            event.stopPropagation()\n\n            this.visible = !this.visible\n        },\n        click(event) {\n            if (this.disabled) {\n                this.visible = false\n                return\n            }\n            this.$emit('click', event)\n        },\n        createPopper(element) {\n            this.removePopper()\n\n            // Define placement\n            let placement = 'bottom-start'\n\n            if (this.dropup && this.right) {\n                placement = 'top-end'\n            } else if (this.dropup) {\n                placement = 'top-start'\n            } else if (this.right) {\n                placement = 'bottom-end'\n            }\n\n            // Build Popper config\n            const popperConfig = {\n                placement,\n                modifiers: {\n                    offset: {\n                        offset: this.offset || 0\n                    },\n                    flip: {\n                        enabled: !this.noFlip\n                    },\n                    computeStyle: {\n                        enabled: true\n                    }\n                }\n            }\n\n            // Define Popper boundaries\n            if (this.boundary) {\n                popperConfig.modifiers.preventOverflow = {\n                    boundariesElement: this.boundary\n                }\n            }\n\n            // Create Popper instance\n            this._popperInstance = new Popper(\n                element,\n                this.$refs.menu,\n                {\n                    ...popperConfig,\n                    ...this.popperOptions\n                }\n            )\n        },\n        removePopper() {\n            if (this._popper) {\n                this._popper.destroy()\n            }\n            this._popperInstance = null\n        },\n        showMenu() {\n            if (this.disabled) {\n                return\n            }\n\n            this.emitOnRoot(DROPDOWN_EVENTS.SHOWN, this)\n\n            if (this.inNavbar === null && this.isNav) {\n                this.inNavbar = Boolean(closest('.navbar', this.$el))\n            }\n\n            if (!this.inNavbar) {\n                let _element = ((this.dropup && this.right) || this.split) ? this.$el : this.$refs.toggle\n                _element = _element.$el || _element\n                this.createPopper(_element)\n            }\n\n            this.$emit('shown')\n            this.$nextTick(this.focusFirstItem)\n        },\n        hideMenu() {\n            this.emitOnRoot(DROPDOWN_EVENTS.HIDDEN, this)\n            this.$emit('hidden')\n            this.removePopper()\n        },\n        away() {\n            this.visible = false\n        }\n    },\n    created() {\n        this._popperInstance = null\n    },\n    mounted() {\n        this.listenOnRoot(DROPDOWN_EVENTS.SHOWN, function(vm) {\n            if (vm !== this) {\n                this.visible = false\n            }\n        })\n\n        this.listenOnRoot(LINK_EVENTS.CLICKED, this.away)\n    },\n    deactivated() {\n        this.visible = false\n        this.removePopper()\n    },\n    beforeDestroy() {\n        this.visible = false\n        this.removePopper()\n    }\n}\n</script>\n\n<style scoped>\n.nav-link:hover {\n    cursor: pointer;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$l = "data-v-68c0b8ac";
      /* module identifier */
      var __vue_module_identifier__$l = undefined;
      /* functional template */
      var __vue_is_functional_template__$l = false;
      /* component normalizer */
      function __vue_normalize__$l(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/dropdown/Dropdown.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$l() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$l.styles || (__vue_create_injector__$l.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dDropdown = __vue_normalize__$l(
        { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
        __vue_inject_styles__$l,
        __vue_script__$l,
        __vue_scope_id__$l,
        __vue_is_functional_template__$l,
        __vue_module_identifier__$l,
        __vue_create_injector__$l,
        undefined
      );

    //

    /**
     * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
     */
    var script$m = {
        name: 'd-dropdown-item',
        props: Object.assign({}, createLinkProps())
    };

    /* script */
                var __vue_script__$m = script$m;
                
    /* template */
    var __vue_render__$m = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "d-link",
        _vm._b(
          { staticClass: "dropdown-item", attrs: { role: "menuitem" } },
          "d-link",
          _vm.$props,
          false
        ),
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$m = [];
    __vue_render__$m._withStripped = true;

      /* style */
      var __vue_inject_styles__$m = function (inject) {
        if (!inject) { return }
        inject("data-v-f0cf116e_0", { source: "\n.dropdown-item[data-v-f0cf116e]:focus {\n    outline: 0;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/dropdown/DropdownItem.vue"],"names":[],"mappings":";AAqBA;IACA,WAAA;CACA","file":"DropdownItem.vue","sourcesContent":["<template>\n    <d-link class=\"dropdown-item\" role=\"menuitem\" v-bind=\"$props\">\n        <slot />\n    </d-link>\n</template>\n\n<script>\nimport createLinkProps from '../link/create-link-props'\n\n/**\n * This subcomponent is inheriting <a href=\"/docs/components/link\">Link</a> component's props.\n */\nexport default {\n    name: 'd-dropdown-item',\n    props: {\n        ...createLinkProps()\n    }\n}\n</script>\n\n<style scoped>\n.dropdown-item:focus {\n    outline: 0;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$m = "data-v-f0cf116e";
      /* module identifier */
      var __vue_module_identifier__$m = undefined;
      /* functional template */
      var __vue_is_functional_template__$m = false;
      /* component normalizer */
      function __vue_normalize__$m(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/dropdown/DropdownItem.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$m() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$m.styles || (__vue_create_injector__$m.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dDropdownItem = __vue_normalize__$m(
        { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
        __vue_inject_styles__$m,
        __vue_script__$m,
        __vue_scope_id__$m,
        __vue_is_functional_template__$m,
        __vue_module_identifier__$m,
        __vue_create_injector__$m,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //

    var script$n = {
        name: 'd-dropdown-header',
        props: {
            /**
             * The component tag.
             */
            tag: {
                type: String,
                default: 'h6'
            },
            /**
             * The component ID.
             */
            id: {
                type: String,
                default: null
            }
        }
    };

    /* script */
                var __vue_script__$n = script$n;
                
    /* template */
    var __vue_render__$n = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "dropdown-header", attrs: { id: _vm.id } },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$n = [];
    __vue_render__$n._withStripped = true;

      /* style */
      var __vue_inject_styles__$n = undefined;
      /* scoped */
      var __vue_scope_id__$n = undefined;
      /* module identifier */
      var __vue_module_identifier__$n = undefined;
      /* functional template */
      var __vue_is_functional_template__$n = false;
      /* component normalizer */
      function __vue_normalize__$n(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/dropdown/DropdownHeader.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$n() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$n.styles || (__vue_create_injector__$n.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dDropdownHeader = __vue_normalize__$n(
        { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
        __vue_inject_styles__$n,
        __vue_script__$n,
        __vue_scope_id__$n,
        __vue_is_functional_template__$n,
        __vue_module_identifier__$n,
        __vue_create_injector__$n,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //

    var script$o = {
        name: 'd-dropdown-divider',
        props: {
            /**
             * The component tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    };

    /* script */
                var __vue_script__$o = script$o;
                
    /* template */
    var __vue_render__$o = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          staticClass: "dropdown-divier",
          attrs: { role: "separator" }
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$o = [];
    __vue_render__$o._withStripped = true;

      /* style */
      var __vue_inject_styles__$o = undefined;
      /* scoped */
      var __vue_scope_id__$o = undefined;
      /* module identifier */
      var __vue_module_identifier__$o = undefined;
      /* functional template */
      var __vue_is_functional_template__$o = false;
      /* component normalizer */
      function __vue_normalize__$o(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/dropdown/DropdownDivider.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$o() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$o.styles || (__vue_create_injector__$o.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dDropdownDivider = __vue_normalize__$o(
        { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
        __vue_inject_styles__$o,
        __vue_script__$o,
        __vue_scope_id__$o,
        __vue_is_functional_template__$o,
        __vue_module_identifier__$o,
        __vue_create_injector__$o,
        undefined
      );

    var components$a = {
        dDropdown: dDropdown,
        dDropdownItem: dDropdownItem,
        dDropdownHeader: dDropdownHeader,
        dDropdownDivider: dDropdownDivider
    };

    var VuePlugin$a = {
      install: function install (Vue) {
        registerComponents(Vue, components$a);
      }
    };

    vueUse(VuePlugin$a);

    //

    var script$p = {
        name: 'd-embed',
        props: {
            /**
             * The embed type.
             */
            type: {
                type: String,
                default: 'iframe',
                validator: function (v) { return EMBED_TYPES.includes(v); }
            },
            /**
             * The embed tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The embed aspect ratio.
             */
            aspect: {
                type: String,
                default: '16by9',
                validator: function (v) { return EMBED_ASPECTS.includes(v); }
            }
        }
    };

    /* script */
                var __vue_script__$p = script$p;
                
    /* template */
    var __vue_render__$p = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: ["embed-responsive", "embed-responsive-" + _vm.aspect]
        },
        [
          _c(
            _vm.type,
            _vm._b(
              { tag: "component", staticClass: "embed-responsive-item" },
              "component",
              _vm.$attrs,
              false
            ),
            [_vm._t("default")],
            2
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$p = [];
    __vue_render__$p._withStripped = true;

      /* style */
      var __vue_inject_styles__$p = undefined;
      /* scoped */
      var __vue_scope_id__$p = undefined;
      /* module identifier */
      var __vue_module_identifier__$p = undefined;
      /* functional template */
      var __vue_is_functional_template__$p = false;
      /* component normalizer */
      function __vue_normalize__$p(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/embed/Embed.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$p() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$p.styles || (__vue_create_injector__$p.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dEmbed = __vue_normalize__$p(
        { render: __vue_render__$p, staticRenderFns: __vue_staticRenderFns__$p },
        __vue_inject_styles__$p,
        __vue_script__$p,
        __vue_scope_id__$p,
        __vue_is_functional_template__$p,
        __vue_module_identifier__$p,
        __vue_create_injector__$p,
        undefined
      );

    var components$b = {
        dEmbed: dEmbed,
    };

    var VuePlugin$b = {
      install: function install (Vue) {
        registerComponents(Vue, components$b);
      }
    };

    vueUse(VuePlugin$b);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$q = {
        name: 'd-form',
        props: {
            /**
             * Whether it should be displayed inline, or not.
             */
            inline: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it is validated, or not.
             */
            validated: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be validated, or not.
             */
            novalidate: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$q = script$q;
                
    /* template */
    var __vue_render__$q = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "form",
        _vm._g(
          _vm._b(
            {
              class: [
                _vm.inline ? "form-inline" : "",
                _vm.validated ? "was-validated" : ""
              ],
              attrs: { novalidate: _vm.novalidate ? true : false }
            },
            "form",
            _vm.$attrs,
            false
          ),
          _vm.$listeners
        ),
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$q = [];
    __vue_render__$q._withStripped = true;

      /* style */
      var __vue_inject_styles__$q = undefined;
      /* scoped */
      var __vue_scope_id__$q = undefined;
      /* module identifier */
      var __vue_module_identifier__$q = undefined;
      /* functional template */
      var __vue_is_functional_template__$q = false;
      /* component normalizer */
      function __vue_normalize__$q(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form/Form.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$q() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$q.styles || (__vue_create_injector__$q.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dForm = __vue_normalize__$q(
        { render: __vue_render__$q, staticRenderFns: __vue_staticRenderFns__$q },
        __vue_inject_styles__$q,
        __vue_script__$q,
        __vue_scope_id__$q,
        __vue_is_functional_template__$q,
        __vue_module_identifier__$q,
        __vue_create_injector__$q,
        undefined
      );

    //
    //
    //
    //
    //
    //

    var script$r = {
        name: 'd-form-row',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    };

    /* script */
                var __vue_script__$r = script$r;
                
    /* template */
    var __vue_render__$r = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "form-row" },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$r = [];
    __vue_render__$r._withStripped = true;

      /* style */
      var __vue_inject_styles__$r = undefined;
      /* scoped */
      var __vue_scope_id__$r = undefined;
      /* module identifier */
      var __vue_module_identifier__$r = undefined;
      /* functional template */
      var __vue_is_functional_template__$r = false;
      /* component normalizer */
      function __vue_normalize__$r(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form/FormRow.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$r() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$r.styles || (__vue_create_injector__$r.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormRow = __vue_normalize__$r(
        { render: __vue_render__$r, staticRenderFns: __vue_staticRenderFns__$r },
        __vue_inject_styles__$r,
        __vue_script__$r,
        __vue_scope_id__$r,
        __vue_is_functional_template__$r,
        __vue_module_identifier__$r,
        __vue_create_injector__$r,
        undefined
      );

    //

    var script$s = {
        name: 'd-form-text',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'small'
            },
            /**
             * The theme color.
             */
            theme: {
                type: String,
                default: 'secondary',
                validator: function (v) { return THEMECOLORS.includes(v); }
            },
            /**
             * Whether it should be displayed inline, or not.
             */
            inline: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$s = script$s;
                
    /* template */
    var __vue_render__$s = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            !_vm.inline ? "form-text" : "",
            Boolean(_vm.theme) ? "text-" + _vm.theme : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$s = [];
    __vue_render__$s._withStripped = true;

      /* style */
      var __vue_inject_styles__$s = undefined;
      /* scoped */
      var __vue_scope_id__$s = undefined;
      /* module identifier */
      var __vue_module_identifier__$s = undefined;
      /* functional template */
      var __vue_is_functional_template__$s = false;
      /* component normalizer */
      function __vue_normalize__$s(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form/FormText.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$s() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$s.styles || (__vue_create_injector__$s.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormText = __vue_normalize__$s(
        { render: __vue_render__$s, staticRenderFns: __vue_staticRenderFns__$s },
        __vue_inject_styles__$s,
        __vue_script__$s,
        __vue_scope_id__$s,
        __vue_is_functional_template__$s,
        __vue_module_identifier__$s,
        __vue_create_injector__$s,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$t = {
        name: 'd-form-feedback',
        props: {
            /**
             * The feedback tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The feedback type.
             */
            type: {
                type: String,
                default: 'valid',
                validator: function (v) { return ['valid', 'invalid'].includes(v); }
            },
            /**
             * Whether it should be forcefully shown, or not.
             */
            forceShow: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$t = script$t;
                
    /* template */
    var __vue_render__$t = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [_vm.type + "-feedback", _vm.forceShow ? "d-block" : ""]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$t = [];
    __vue_render__$t._withStripped = true;

      /* style */
      var __vue_inject_styles__$t = undefined;
      /* scoped */
      var __vue_scope_id__$t = undefined;
      /* module identifier */
      var __vue_module_identifier__$t = undefined;
      /* functional template */
      var __vue_is_functional_template__$t = false;
      /* component normalizer */
      function __vue_normalize__$t(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form/FormFeedback.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$t() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$t.styles || (__vue_create_injector__$t.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormFeedback = __vue_normalize__$t(
        { render: __vue_render__$t, staticRenderFns: __vue_staticRenderFns__$t },
        __vue_inject_styles__$t,
        __vue_script__$t,
        __vue_scope_id__$t,
        __vue_is_functional_template__$t,
        __vue_module_identifier__$t,
        __vue_create_injector__$t,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$u = {
        name: 'd-form-valid-feedback',
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether it should be forcefully shown, or not.
             */
            forceShow: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$u = script$u;
                
    /* template */
    var __vue_render__$u = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: ["valid-feedback", _vm.forceShow ? "d-block" : ""],
          attrs: { id: _vm.id }
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$u = [];
    __vue_render__$u._withStripped = true;

      /* style */
      var __vue_inject_styles__$u = undefined;
      /* scoped */
      var __vue_scope_id__$u = undefined;
      /* module identifier */
      var __vue_module_identifier__$u = undefined;
      /* functional template */
      var __vue_is_functional_template__$u = false;
      /* component normalizer */
      function __vue_normalize__$u(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form/FormValidFeedback.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$u() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$u.styles || (__vue_create_injector__$u.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormValidFeedback = __vue_normalize__$u(
        { render: __vue_render__$u, staticRenderFns: __vue_staticRenderFns__$u },
        __vue_inject_styles__$u,
        __vue_script__$u,
        __vue_scope_id__$u,
        __vue_is_functional_template__$u,
        __vue_module_identifier__$u,
        __vue_create_injector__$u,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$v = {
        name: 'd-form-invalid-feedback',
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether it should be forcefully shown, or not.
             */
            forceShow: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$v = script$v;
                
    /* template */
    var __vue_render__$v = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: ["invalid-feedback", _vm.forceShow ? "d-block" : ""],
          attrs: { id: _vm.id }
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$v = [];
    __vue_render__$v._withStripped = true;

      /* style */
      var __vue_inject_styles__$v = undefined;
      /* scoped */
      var __vue_scope_id__$v = undefined;
      /* module identifier */
      var __vue_module_identifier__$v = undefined;
      /* functional template */
      var __vue_is_functional_template__$v = false;
      /* component normalizer */
      function __vue_normalize__$v(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form/FormInvalidFeedback.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$v() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$v.styles || (__vue_create_injector__$v.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormInvalidFeedback = __vue_normalize__$v(
        { render: __vue_render__$v, staticRenderFns: __vue_staticRenderFns__$v },
        __vue_inject_styles__$v,
        __vue_script__$v,
        __vue_scope_id__$v,
        __vue_is_functional_template__$v,
        __vue_module_identifier__$v,
        __vue_create_injector__$v,
        undefined
      );

    var components$c = {
        dForm: dForm,
        dFormRow: dFormRow,
        dFormText: dFormText,
        dFormFeedback: dFormFeedback,
        dFormValidFeedback: dFormValidFeedback,
        dValidFeedback: dFormValidFeedback,
        dFormInvalidFeedback: dFormInvalidFeedback,
        dInvalidFeedback: dFormInvalidFeedback
    };

    var VuePlugin$c = {
      install: function install (Vue) {
        registerComponents(Vue, components$c);
      }
    };

    vueUse(VuePlugin$c);

    //

    var script$w = {
        name: 'd-form-checkbox',
        model: {
            prop: 'checked',
            event: 'input'
        },
        data: function data() {
            return {
                localState: this.checked
            }
        },
        props: {
            /**
             * The checkbox input name.
             */
            name: {
                type: String
            },
            /**
             * The checkbox input ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The checkbox input value.
             */
            value: {
                default: true
            },
            /**
             * The checkbox input unchecked state value.
             */
            uncheckedValue: {
                default: false
            },
            /**
             * The disabled state.
             */
            disabled: {
                type: Boolean
            },
            /**
             * The required state.
             */
            required: {
                type: Boolean,
                default: false
            },
            /**
             * The checked state.
             */
            checked: {
                type: [Boolean, String, Array]
            },
            /**
             * The indeterminate state.
             */
            indeterminate: {
                type: Boolean,
                default: false
            },
            /**
             * The validation state.
             */
            state: {
                type: [Boolean, String],
                default: null
            },
            /**
             * Display as toggle.
             */
            toggle: {
                type: Boolean,
                default: false
            },
            /**
             * Display as small toggle.
             */
            toggleSmall: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the checkbox should be displayed inline, or not.
             */
            inline: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedLocalState: {
                get: function get() {
                    return this.localState
                },

                set: function set(val) {
                    this.localState = val;
                }
            },
            computedID: function computedID() {
                return this.id || ("dr-checkbox-" + (guid()))
            },
            computedState: function computedState() {
                if (this.state === true || this.state === 'valid') {
                    return true
                }

                if (this.state === false || this.state === 'invalid') {
                    return false
                }

                return null
            },
            computedStateClass: function computedStateClass() {
                if (this.computedState === true) {
                    return 'is-valid'
                }

                if (this.computedState === false) {
                    return 'is-invalid'
                }

                return null
            }
        },
        watch: {
            computedLocalState: function computedLocalState(newVal, oldVal) {
                if (newVal == oldVal) {
                    return
                }

                this.$emit('input', newVal);
                this.$emit('update:indeterminate', this.$refs.check.indeterminate);
            },

            checked: function checked(newVal, oldVal) {
                if (newVal == oldVal) {
                    return
                }

                this.computedLocalState = newVal;
            },

            indeterminate: function indeterminate(newVal) {
                this.setIndeterminate(newVal);
            }
        },

        methods: {
            handleChange: function handleChange(e) {
                this.$emit('change', e.target.checked ? this.value : this.uncheckedValue);
                this.$emit('update:indeterminate', this.$refs.check.indeterminate);
            },

            setIndeterminate: function setIndeterminate(state) {
                this.$refs.check.indeterminate = state;
                this.$emit('update:indeterminate', this.$refs.check.indeterminate);
            }
        },

        mounted: function mounted() {
            this.setIndeterminate(this.indeterminate);
        }
    };

    /* script */
                var __vue_script__$w = script$w;
                
    /* template */
    var __vue_render__$w = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "label",
        {
          class: [
            "custom-control",
            !_vm.toggle ? "custom-checkbox" : "custom-toggle",
            _vm.toggle && _vm.toggleSmall ? "custom-toggle-sm" : "",
            _vm.inline ? "custom-control-inline" : "",
            _vm.computedStateClass
          ]
        },
        [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.computedLocalState,
                expression: "computedLocalState"
              }
            ],
            ref: "check",
            class: ["custom-control-input", _vm.computedStateClass],
            attrs: {
              type: "checkbox",
              autocomplete: "off",
              "aria-required": _vm.required ? "true" : null,
              id: _vm.computedID,
              name: _vm.name,
              "true-value": _vm.value,
              "false-value": _vm.uncheckedValue,
              disabled: _vm.disabled,
              required: _vm.required
            },
            domProps: {
              value: _vm.value,
              checked: Array.isArray(_vm.computedLocalState)
                ? _vm._i(_vm.computedLocalState, _vm.value) > -1
                : _vm._q(_vm.computedLocalState, _vm.value)
            },
            on: {
              change: [
                function($event) {
                  var $$a = _vm.computedLocalState,
                    $$el = $event.target,
                    $$c = $$el.checked ? _vm.value : _vm.uncheckedValue;
                  if (Array.isArray($$a)) {
                    var $$v = _vm.value,
                      $$i = _vm._i($$a, $$v);
                    if ($$el.checked) {
                      $$i < 0 && (_vm.computedLocalState = $$a.concat([$$v]));
                    } else {
                      $$i > -1 &&
                        (_vm.computedLocalState = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)));
                    }
                  } else {
                    _vm.computedLocalState = $$c;
                  }
                },
                _vm.handleChange
              ]
            }
          }),
          _vm._v(" "),
          _c("label", {
            staticClass: "custom-control-label",
            attrs: { for: _vm.computedID, "aria-hidden": "true" }
          }),
          _vm._v(" "),
          _c(
            "span",
            { class: ["custom-control-description"] },
            [_vm._t("default")],
            2
          )
        ]
      )
    };
    var __vue_staticRenderFns__$w = [];
    __vue_render__$w._withStripped = true;

      /* style */
      var __vue_inject_styles__$w = undefined;
      /* scoped */
      var __vue_scope_id__$w = undefined;
      /* module identifier */
      var __vue_module_identifier__$w = undefined;
      /* functional template */
      var __vue_is_functional_template__$w = false;
      /* component normalizer */
      function __vue_normalize__$w(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form-checkbox/FormCheckbox.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$w() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$w.styles || (__vue_create_injector__$w.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormCheckbox = __vue_normalize__$w(
        { render: __vue_render__$w, staticRenderFns: __vue_staticRenderFns__$w },
        __vue_inject_styles__$w,
        __vue_script__$w,
        __vue_scope_id__$w,
        __vue_is_functional_template__$w,
        __vue_module_identifier__$w,
        __vue_create_injector__$w,
        undefined
      );

    var components$d = {
        dFormCheckbox: dFormCheckbox,
        dCheckbox: dFormCheckbox
    };

    var VuePlugin$d = {
      install: function install (Vue) {
        registerComponents(Vue, components$d);
      }
    };

    vueUse(VuePlugin$d);

    //

    var script$x = {
        name: 'd-form-input',
        props: {
            /**
             * Input type.
             */
            type: {
                type: String,
                default: 'text',
                validator: function (v) { return INPUT_TYPES.includes(v); }
            },
            /**
             * Input value.
             */
            value: {
                type: [String, Number],
                default: ''
            },
            /**
             * Input size.
             */
            size: {
                type: String,
                default: null
            },
            /**
             * Input state. eg: 'valid', 'invalid'
             */
            state: {
                type: [Boolean, String],
                default: null,
                validator: function (v) { return [null, 'valid', 'invalid', true, false].includes(v); }
            },
            /**
             * Input name.
             */
            name: {
                type: String
            },
            /**
             * Input disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * Input required state.
             */
            required: {
                type: Boolean,
                default: false
            },
            /**
             * Input placeholder text.
             */
            placeholder: {
                type: String,
                default: null
            },
            /**
             * Enable or disable field autocomplete.
             */
            autocomplete: {
                type: String,
                default: null
            },
            /**
             * Display as plain text and remove styling.
             */
            plaintext: {
                type: Boolean,
                default: false
            },
            /**
             * Display as read-only.
             */
            readonly: {
                type: Boolean,
                default: false
            },
            /**
             * The input `aria-invalid` attribute.
             */
            ariaInvalid: {
                type: [Boolean, String],
                default: false
            }
        },
        watch: {
            value: function value (newVal) {
                this.setValue(newVal);
            }
        },
        mounted: function mounted() {
            if (this.value) {
                this.setValue(this.value);
            }
        },
        computed: {
            computedID: function computedID() {
                return ("dr-input-" + (guid()))
            },
            computedAriaInvalid: function computedAriaInvalid() {
                if (!this.ariaInvalid || this.ariaInvalid === 'false') {
                    return this.state === 'invalid' ? 'true' : null
                }

                if (this.ariaInvalid === true) {
                    return 'true'
                }

                return this.ariaInvalid
            },
            computedState: function computedState() {
                if (this.state === true || this.state === 'valid') {
                    return true
                } else if (this.state === false || this.state === 'invalid') {
                    return false
                }

                return null
            },
            computedStateClass: function computedStateClass() {
                if (this.computedState === true || this.computedState === 'valid') {
                    return 'is-valid'
                } else if (this.computedState === false) {
                    return 'is-invalid'
                }

                return null
            }
        },
        methods: {
            setValue: function setValue(value) {
                this.$refs.input.value = value;
                this.$emit('input', value);
            },
            onInput: function onInput(e) {
                this.setValue(e.target.value);
            },
            onChange: function onChange(e) {
                this.setValue(e.target.value);
                this.$emit('change', e.target.value);
            }
        }
    };

    /* script */
                var __vue_script__$x = script$x;
                
    /* template */
    var __vue_render__$x = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "input",
        _vm._b(
          {
            ref: "input",
            class: [
              _vm.plaintext ? "form-control-plaintext" : "form-control",
              _vm.plaintext ? "w-100" : "",
              _vm.size ? "form-control-" + _vm.size : null,
              _vm.computedStateClass
            ],
            attrs: {
              id: _vm.computedID,
              type: _vm.type,
              name: _vm.name,
              disabled: _vm.disabled,
              required: _vm.required,
              readonly: _vm.readonly || _vm.plaintext,
              placeholder: _vm.placeholder,
              autocomplete: _vm.autocomplete,
              "aria-required": _vm.required ? true : null,
              "aria-invalid": _vm.computedAriaInvalid
            },
            domProps: { value: _vm.value },
            on: { input: _vm.onInput, change: _vm.onChange }
          },
          "input",
          _vm.$attrs,
          false
        )
      )
    };
    var __vue_staticRenderFns__$x = [];
    __vue_render__$x._withStripped = true;

      /* style */
      var __vue_inject_styles__$x = undefined;
      /* scoped */
      var __vue_scope_id__$x = undefined;
      /* module identifier */
      var __vue_module_identifier__$x = undefined;
      /* functional template */
      var __vue_is_functional_template__$x = false;
      /* component normalizer */
      function __vue_normalize__$x(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form-input/FormInput.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$x() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$x.styles || (__vue_create_injector__$x.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormInput = __vue_normalize__$x(
        { render: __vue_render__$x, staticRenderFns: __vue_staticRenderFns__$x },
        __vue_inject_styles__$x,
        __vue_script__$x,
        __vue_scope_id__$x,
        __vue_is_functional_template__$x,
        __vue_module_identifier__$x,
        __vue_create_injector__$x,
        undefined
      );

    var components$e = {
        dFormInput: dFormInput,
        dInput: dFormInput
    };

    var VuePlugin$e = {
      install: function install (Vue) {
        registerComponents(Vue, components$e);
      }
    };

    vueUse(VuePlugin$e);

    //

    var script$y = {
        name: 'd-form-radio',
        model: {
            prop: 'checked',
            event: 'input'
        },
        data: function data() {
            return {
                localChecked: this.checked
            }
        },
        props: {
            /**
             * The radio input name.
             */
            name: {
                type: String
            },
            /**
             * The radio input ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The radio input value.
             */
            value: {
                default: true
            },
            /**
             * The disabled state.
             */
            disabled: {
                type: Boolean
            },
            /**
             * The required state.
             */
            required: {
                type: Boolean,
                default: false
            },
            /**
             * The checked state.
             */
            checked: {
                type: [Boolean, String, Array]
            },
            /**
             * The validation state.
             */
            state: {
                type: [Boolean, String],
                default: null
            },
            /**
             * Whether the radio should be displayed inline, or not.
             */
            inline: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedLocalChecked: {
                get: function get() {
                    return this.localChecked
                },

                set: function set(val) {
                    this.localChecked = val;
                }
            },
            computedID: function computedID() {
                return this.id || ("dr-radio-" + (guid()))
            },
            computedState: function computedState() {
                if (this.state === true || this.state === 'valid') {
                    return true
                }

                if (this.state === false || this.state === 'invalid') {
                    return false
                }

                return null
            },
            computedStateClass: function computedStateClass() {
                if (this.computedState === true) {
                    return 'is-valid'
                }

                if (this.computedState === false) {
                    return 'is-invalid'
                }

                return null
            }
        },
        watch: {
            computedLocalChecked: function computedLocalChecked(newVal, oldVal) {
                if (newVal == oldVal) {
                    return
                }

                this.$emit('input', newVal);
            },

            checked: function checked(newVal, oldVal) {
                if (newVal == oldVal) {
                    return
                }

                this.computedLocalChecked = newVal;
            },
        },

        methods: {
            handleChange: function handleChange(e) {
                this.$emit('change', e.target.checked ? this.value : null);
            }
        }
    };

    /* script */
                var __vue_script__$y = script$y;
                
    /* template */
    var __vue_render__$y = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "label",
        {
          class: [
            "custom-control",
            "custom-radio",
            _vm.inline ? "custom-control-inline" : "",
            _vm.computedStateClass
          ]
        },
        [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.computedLocalChecked,
                expression: "computedLocalChecked"
              }
            ],
            ref: "check",
            class: ["custom-control-input", _vm.computedStateClass],
            attrs: {
              type: "radio",
              autocomplete: "off",
              "aria-required": _vm.required ? "true" : null,
              id: _vm.computedID,
              name: _vm.name,
              disabled: _vm.disabled,
              required: _vm.name && _vm.required
            },
            domProps: {
              value: _vm.value,
              checked: _vm._q(_vm.computedLocalChecked, _vm.value)
            },
            on: {
              change: [
                function($event) {
                  _vm.computedLocalChecked = _vm.value;
                },
                _vm.handleChange
              ]
            }
          }),
          _vm._v(" "),
          _c("label", {
            staticClass: "custom-control-label",
            attrs: { for: _vm.computedID, "aria-hidden": "true" }
          }),
          _vm._v(" "),
          _c(
            "span",
            { class: ["custom-control-description"] },
            [_vm._t("default")],
            2
          )
        ]
      )
    };
    var __vue_staticRenderFns__$y = [];
    __vue_render__$y._withStripped = true;

      /* style */
      var __vue_inject_styles__$y = undefined;
      /* scoped */
      var __vue_scope_id__$y = undefined;
      /* module identifier */
      var __vue_module_identifier__$y = undefined;
      /* functional template */
      var __vue_is_functional_template__$y = false;
      /* component normalizer */
      function __vue_normalize__$y(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form-radio/FormRadio.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$y() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$y.styles || (__vue_create_injector__$y.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormRadio = __vue_normalize__$y(
        { render: __vue_render__$y, staticRenderFns: __vue_staticRenderFns__$y },
        __vue_inject_styles__$y,
        __vue_script__$y,
        __vue_scope_id__$y,
        __vue_is_functional_template__$y,
        __vue_module_identifier__$y,
        __vue_create_injector__$y,
        undefined
      );

    var components$f = {
        dFormRadio: dFormRadio,
        dRadio: dFormRadio
    };

    var VuePlugin$f = {
      install: function install (Vue) {
        registerComponents(Vue, components$f);
      }
    };

    vueUse(VuePlugin$f);

    //

    var script$z = {
        name: 'd-form-select',
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The element name.
             */
            name: {
                type: String
            },
            /**
             * The select options.
             */
            options: {
                type: [Array, Object],
                default: function default$1() {
                    return []
                }
            },
            /**
             * The select value.
             */
            value: {},
            /**
             * Whether it should allow multiple selections, or not.
             */
            multiple: {
                type: Boolean,
                default: false
            },
            /**
             * How many options should be visible.
             */
            selectSize: {
                type: Number,
                default: 0
            },
            /**
             * Controls the `aria-invalid` attribute.
             */
            ariaInvalid: {
                type: [Boolean, String],
                default: false
            },
            /**
             * The value field.
             */
            valueField: {
                type: String,
                default: 'value'
            },
            /**
             * The disabled field.
             */
            disabledField: {
                type: String,
                default: 'disabled'
            },
            /**
             * The text field.
             */
            textField: {
                type: String,
                default: 'text'
            },
            /**
             * The disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * The required state.
             */
            required: {
                type: Boolean,
                default: false
            },
            /**
             * The validity state (invalid, valid, true, false).
             */
            state: {
                type: [Boolean, String],
                default: null,
                validator: function (v) { return ['valid', 'invalid', true, false, null].includes(v); }
            },
            /**
             * The form control size (sm, lg).
             */
            size: {
                type: String,
                default: null,
                validator: function (v) { return ['sm', 'lg', null].includes(v); }
            }
        },
        data: function data() {
            return {
                localValue: this.value
            }
        },
        watch: {
            value: function value(newVal) {
                this.localValue = newVal;
            },

            localValue: function localValue() {
                this.$emit('input', this.localValue);
            }
        },
        computed: {
            computedID: function computedID() {
                return this.id || ("dr-select-" + (guid()))
            },

            computedState: function computedState() {
                if (this.state === true || this.state === 'valid') {
                    return true
                }

                if (this.state === false || this.state === 'invalid') {
                    return false
                }

                return null
            },

            stateClass: function stateClass() {
                if (this.computedState === true) {
                    return 'is-valid'
                } else if (this.computedState === false) {
                    return 'is-invalid'
                }

                return null
            },

            computedAriaInvalid: function computedAriaInvalid() {
                if (this.ariaInvalid === true || this.ariaInvalid === 'true') {
                    return 'true';
                }

                return this.stateClass == 'is-invalid' ? 'true' : null;
            },

            formOptions: function formOptions() {
                var options = this.options || {};
                var valueField = this.valueField || 'value';
                var textField = this.textField || 'text';
                var disabledField = this.disabledField || 'disabled';

                // Parse array options
                if (Array.isArray(options)) {
                    return options.map(function (option) {
                        if (typeof option === 'object') {
                            return {
                                value: option[valueField],
                                text: String(option[textField]),
                                disabled: option[disabledField] || false
                            }
                        }

                        return { text: String(option), value: option, disabled: false }
                    })

                // Parse object options
                } else if (typeof options === 'object') {
                    return Object.keys(options).map(function (key) {
                        var option = options[key] || {};

                        if (typeof option === 'object') {
                            var value = option[valueField];
                            var text = option[textField];

                            return {
                                text: typeof text === 'undefined' ? key : String(text),
                                value: typeof value === 'undefined' ? key : value,
                                disabled: option[disabledField] || false
                            }
                        }

                        return { text: String(option), value: key, disabled: false }
                    })
                }

                return []
            }
        },
        methods: {
            handleChange: function handleChange(evt) {
                var target = evt.target;
                var selectedVal = Array.from(target.options)
                                        .filter(function (opt) { return opt.selected; })
                                        .map(function (opt) { return '_value' in opt ? opt._value : opt.value; });

                this.localValue = target.multiple ? selectedVal : selectedVal[0];
                this.$emit('change', this.localValue);
            }
        }
    };

    /* script */
                var __vue_script__$z = script$z;
                
    /* template */
    var __vue_render__$z = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "select",
        {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.localValue,
              expression: "localValue"
            }
          ],
          ref: "input",
          class: [
            "form-control",
            _vm.stateClass,
            _vm.size ? "form-control-" + _vm.size : null,
            !_vm.multiple && _vm.selectSize > 1 ? null : "custom-select"
          ],
          attrs: {
            id: _vm.computedID,
            name: _vm.name,
            multiple: _vm.multiple || null,
            size: _vm.multiple || _vm.selectSize > 1 ? _vm.selectSize : null,
            disabled: _vm.disabled,
            required: _vm.required,
            "aria-required": _vm.required ? true : null,
            "aria-invalid": _vm.computedAriaInvalid
          },
          on: {
            change: [
              function($event) {
                var $$selectedVal = Array.prototype.filter
                  .call($event.target.options, function(o) {
                    return o.selected
                  })
                  .map(function(o) {
                    var val = "_value" in o ? o._value : o.value;
                    return val
                  });
                _vm.localValue = $event.target.multiple
                  ? $$selectedVal
                  : $$selectedVal[0];
              },
              _vm.handleChange
            ]
          }
        },
        [
          _vm._l(_vm.formOptions, function(option, idx) {
            return _c(
              "option",
              {
                key: "dr-opt-" + idx,
                attrs: { disabled: Boolean(option.disabled) },
                domProps: { value: option.value }
              },
              [_vm._v("\n            " + _vm._s(option.text) + "\n    ")]
            )
          }),
          _vm._v(" "),
          _vm._t("default")
        ],
        2
      )
    };
    var __vue_staticRenderFns__$z = [];
    __vue_render__$z._withStripped = true;

      /* style */
      var __vue_inject_styles__$z = function (inject) {
        if (!inject) { return }
        inject("data-v-7666fa81_0", { source: "\n.custom-select[data-v-7666fa81] {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/form-select/FormSelect.vue"],"names":[],"mappings":";AAgPA;IACA,yBAAA;IACA,sBAAA;IACA,iBAAA;CACA","file":"FormSelect.vue","sourcesContent":["<template>\n    <select ref=\"input\"\n        :class=\"[\n            'form-control',\n            stateClass,\n            size ? `form-control-${size}` : null,\n            !multiple && selectSize > 1 ? null : 'custom-select'\n        ]\"\n        v-model=\"localValue\"\n        :id=\"computedID\"\n        :name=\"name\"\n        :multiple=\"multiple || null\"\n        :size=\"(multiple || selectSize > 1) ? selectSize : null\"\n        :disabled=\"disabled\"\n        :required=\"required\"\n        :aria-required=\"required ? true : null\"\n        :aria-invalid=\"computedAriaInvalid\"\n        @change=\"handleChange\" >\n        <option v-for=\"(option, idx) in formOptions\"\n            :key=\"`dr-opt-${idx}`\"\n            :value=\"option.value\"\n            :disabled=\"Boolean(option.disabled)\">\n                {{ option.text }}\n        </option>\n        <slot />\n    </select>\n</template>\n\n<script>\nimport { guid } from '../../utils'\n\nexport default {\n    name: 'd-form-select',\n    props: {\n        /**\n         * The element ID.\n         */\n        id: {\n            type: String,\n            default: null\n        },\n        /**\n         * The element name.\n         */\n        name: {\n            type: String\n        },\n        /**\n         * The select options.\n         */\n        options: {\n            type: [Array, Object],\n            default() {\n                return []\n            }\n        },\n        /**\n         * The select value.\n         */\n        value: {},\n        /**\n         * Whether it should allow multiple selections, or not.\n         */\n        multiple: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * How many options should be visible.\n         */\n        selectSize: {\n            type: Number,\n            default: 0\n        },\n        /**\n         * Controls the `aria-invalid` attribute.\n         */\n        ariaInvalid: {\n            type: [Boolean, String],\n            default: false\n        },\n        /**\n         * The value field.\n         */\n        valueField: {\n            type: String,\n            default: 'value'\n        },\n        /**\n         * The disabled field.\n         */\n        disabledField: {\n            type: String,\n            default: 'disabled'\n        },\n        /**\n         * The text field.\n         */\n        textField: {\n            type: String,\n            default: 'text'\n        },\n        /**\n         * The disabled state.\n         */\n        disabled: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The required state.\n         */\n        required: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The validity state (invalid, valid, true, false).\n         */\n        state: {\n            type: [Boolean, String],\n            default: null,\n            validator: v => ['valid', 'invalid', true, false, null].includes(v)\n        },\n        /**\n         * The form control size (sm, lg).\n         */\n        size: {\n            type: String,\n            default: null,\n            validator: v => ['sm', 'lg', null].includes(v)\n        }\n    },\n    data() {\n        return {\n            localValue: this.value\n        }\n    },\n    watch: {\n        value(newVal) {\n            this.localValue = newVal\n        },\n\n        localValue() {\n            this.$emit('input', this.localValue)\n        }\n    },\n    computed: {\n        computedID() {\n            return this.id || `dr-select-${guid()}`\n        },\n\n        computedState() {\n            if (this.state === true || this.state === 'valid') {\n                return true\n            }\n\n            if (this.state === false || this.state === 'invalid') {\n                return false\n            }\n\n            return null\n        },\n\n        stateClass() {\n            if (this.computedState === true) {\n                return 'is-valid'\n            } else if (this.computedState === false) {\n                return 'is-invalid'\n            }\n\n            return null\n        },\n\n        computedAriaInvalid() {\n            if (this.ariaInvalid === true || this.ariaInvalid === 'true') {\n                return 'true';\n            }\n\n            return this.stateClass == 'is-invalid' ? 'true' : null;\n        },\n\n        formOptions() {\n            let options = this.options || {}\n            const valueField = this.valueField || 'value'\n            const textField = this.textField || 'text'\n            const disabledField = this.disabledField || 'disabled'\n\n            // Parse array options\n            if (Array.isArray(options)) {\n                return options.map(option => {\n                    if (typeof option === 'object') {\n                        return {\n                            value: option[valueField],\n                            text: String(option[textField]),\n                            disabled: option[disabledField] || false\n                        }\n                    }\n\n                    return { text: String(option), value: option, disabled: false }\n                })\n\n            // Parse object options\n            } else if (typeof options === 'object') {\n                return Object.keys(options).map(key => {\n                    let option = options[key] || {}\n\n                    if (typeof option === 'object') {\n                        const value = option[valueField]\n                        const text = option[textField]\n\n                        return {\n                            text: typeof text === 'undefined' ? key : String(text),\n                            value: typeof value === 'undefined' ? key : value,\n                            disabled: option[disabledField] || false\n                        }\n                    }\n\n                    return { text: String(option), value: key, disabled: false }\n                })\n            }\n\n            return []\n        }\n    },\n    methods: {\n        handleChange(evt) {\n            const target = evt.target;\n            const selectedVal = Array.from(target.options)\n                                    .filter(opt => opt.selected)\n                                    .map(opt => '_value' in opt ? opt._value : opt.value)\n\n            this.localValue = target.multiple ? selectedVal : selectedVal[0];\n            this.$emit('change', this.localValue);\n        }\n    }\n}\n</script>\n\n<style scoped>\n    .custom-select {\n        -webkit-appearance: none;\n        -moz-appearance: none;\n        appearance: none;\n    }\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$z = "data-v-7666fa81";
      /* module identifier */
      var __vue_module_identifier__$z = undefined;
      /* functional template */
      var __vue_is_functional_template__$z = false;
      /* component normalizer */
      function __vue_normalize__$z(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form-select/FormSelect.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$z() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$z.styles || (__vue_create_injector__$z.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormSelect = __vue_normalize__$z(
        { render: __vue_render__$z, staticRenderFns: __vue_staticRenderFns__$z },
        __vue_inject_styles__$z,
        __vue_script__$z,
        __vue_scope_id__$z,
        __vue_is_functional_template__$z,
        __vue_module_identifier__$z,
        __vue_create_injector__$z,
        undefined
      );

    var components$g = {
        dFormSelect: dFormSelect,
        dSelect: dFormSelect
    };

    var VuePlugin$g = {
      install: function install (Vue) {
        registerComponents(Vue, components$g);
      }
    };

    vueUse(VuePlugin$g);

    //

    var script$A = {
      name: "d-form-textarea",
      data: function data() {
        return {
          localValue: this.value
        };
      },
      props: {
        /**
         * The element name.
         */
        name: {
          type: String,
          default: null
        },
        /**
         * The element ID.
         */
        id: {
          type: String,
          default: null
        },
        /**
         * The disabled state.
         */
        disabled: {
          type: Boolean,
          required: false
        },
        /**
         * The required state.
         */
        required: {
          type: Boolean,
          required: false
        },
        /**
         * The validity state.
         */
        state: {
          type: [Boolean, String],
          default: null,
          validator: function (v) { return ["valid", "invalid", true, false, null].includes(v); }
        },
        /**
         * The element's size.
         */
        size: {
          type: String,
          default: null,
          validator: function (v) { return ["sm", "lg", null].includes(v); }
        },
        /**
         * The placeholder value.
         */
        placeholder: {
          type: String,
          default: null
        },
        /**
         * The autocomplete status.
         */
        autocomplete: {
          type: String,
          default: null
        },
        /**
         * Whether the textarea should be read-only, or not.
         */
        readonly: {
          type: Boolean,
          default: false
        },
        /**
         * Whether the textarea should be plain-text, or not.
         */
        plaintext: {
          type: Boolean,
          default: false
        },
        /**
         * The number of text rows.
         */
        rows: {
          type: [Number, String],
          default: null
        },
        /**
         * The textarea wrap style.
         */
        wrap: {
          type: String,
          default: "soft",
          validator: function (v) { return ["soft", "hard", "off"].includes(v); }
        },
        /**
         * Whether resizing should be disabled, or not.
         */
        noResize: {
          type: Boolean,
          default: false
        },
        /**
         * The maximum number of rows allowed.
         */
        maxRows: {
          type: [Number, String],
          default: null
        }
      },
      mounted: function mounted() {
        this.el = this.$el;
      },
      computed: {
        computedID: function computedID() {
          return this.id || ("dr-textarea-" + (guid()));
        },
        computedStyle: function computedStyle() {
          return {
            width: this.plaintext ? "100%" : null,
            height: this.computedHeight,
            resize: this.noResize ? "none" : null
          };
        },
        computedMinRows: function computedMinRows() {
          return Math.max(parseInt(this.rows, 10) || 2, 2);
        },
        computedMaxRows: function computedMaxRows() {
          return Math.max(this.computedMinRows, parseInt(this.maxRows, 10) || 0);
        },
        computedHeight: function computedHeight() {
          if (this.localValue === null || !isVisible(this.el)) {
            return null;
          }

          var _height = this.el.style.height;

          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.el.style.height = "inherit";

          var computed = getComputedStyles(this.el);
          var minHeight =
            parseInt(computed.height, 10) || lineHeight * this.computedMinRows;

          var lineHeight = parseFloat(computed.lineHeight);
          var offset =
            parseInt(computed.borderTopWidth, 10) +
            parseInt(computed.paddingTop, 10) +
            parseInt(computed.paddingBottom, 10) +
            parseInt(computed.borderBottomWidth, 10);

          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.el.style.height = _height;

          var rows = Math.min(
            Math.max(
              (this.el.scrollHeight - offset) / lineHeight,
              this.computedMinRows
            ),
            this.computedMaxRows - 1
          );

          if (!this.localValue.trim()) {
            return (minHeight + "px");
          }

          return ((Math.max(Math.ceil(rows * lineHeight + offset), minHeight)) + "px");
        },
        computedAriaInvalid: function computedAriaInvalid() {
          // eslint-disable-next-line
          if (!Boolean(this.ariaInvalid) || this.ariaInvalid === "false") {
            return this.computedState === false ? "true" : null;
          }

          if (this.ariaInvalid === true) {
            return "true";
          }

          return this.ariaInvalid;
        },
        computedState: function computedState() {
          if (this.state === true || this.state === "valid") {
            return true;
          }

          if (this.state === false || this.state === "invalid") {
            return false;
          }

          return null;
        },
        stateClass: function stateClass() {
          if (this.computedState === true) {
            return "is-valid";
          }

          if (this.computedState === false) {
            return "is-invalid";
          }

          return null;
        }
      },
      watch: {
        value: function value(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.localValue = newVal;
          }
        },
        localValue: function localValue(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.$emit("input", newVal);
          }
        }
      },
      methods: {
        handleInput: function handleInput(e) {
          this.localValue = e.target.value;
        }
      }
    };

    /* script */
                var __vue_script__$A = script$A;
                
    /* template */
    var __vue_render__$A = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("textarea", {
        ref: "input",
        class: [
          _vm.plaintext ? "form-control-plaintext" : "form-control",
          _vm.plaintext ? "w-100" : "",
          _vm.size ? "form-control-" + this.size : null,
          _vm.stateClass
        ],
        style: _vm.computedStyle,
        attrs: {
          name: _vm.name,
          id: _vm.computedID,
          disabled: _vm.disabled,
          required: _vm.required,
          placeholder: _vm.placeholder,
          autocomplete: _vm.autocomplete,
          readonly: _vm.readonly || _vm.plaintext,
          rows: _vm.rows,
          wrap: _vm.wrap,
          "aria-required": _vm.required ? "true" : null,
          "aria-invalid": _vm.computedAriaInvalid
        },
        on: { input: _vm.handleInput }
      })
    };
    var __vue_staticRenderFns__$A = [];
    __vue_render__$A._withStripped = true;

      /* style */
      var __vue_inject_styles__$A = undefined;
      /* scoped */
      var __vue_scope_id__$A = undefined;
      /* module identifier */
      var __vue_module_identifier__$A = undefined;
      /* functional template */
      var __vue_is_functional_template__$A = false;
      /* component normalizer */
      function __vue_normalize__$A(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/form-textarea/FormTextarea.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$A() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$A.styles || (__vue_create_injector__$A.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dFormTextarea = __vue_normalize__$A(
        { render: __vue_render__$A, staticRenderFns: __vue_staticRenderFns__$A },
        __vue_inject_styles__$A,
        __vue_script__$A,
        __vue_scope_id__$A,
        __vue_is_functional_template__$A,
        __vue_module_identifier__$A,
        __vue_create_injector__$A,
        undefined
      );

    var components$h = {
        dFormTextarea: dFormTextarea,
        dTextarea: dFormTextarea
    };

    var VuePlugin$h = {
      install: function install (Vue) {
        registerComponents(Vue, components$h);
      }
    };

    vueUse(VuePlugin$h);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$B = {
        name: 'd-image',
        props: {
            /**
             * The image source.
             */
            src: {
                type: String,
                default: null
            },
            /**
             * The image alternative text.
             */
            alt: {
                type: String,
                default: null
            },
            /**
             * The image width.
             */
            width: {
                type: [Number, String],
                default: null
            },
            /**
             * The image height.
             */
            height: {
                type: [Number, String],
                default: null
            },
            /**
             * Whether the image should be fluid, or not.
             */
            fluid: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the image should take up the entire space (in width).
             */
            fluidGrow: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the image should be rounded.
             */
            rounded: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the image should be displayed as a thumbnail.
             */
            thumbnail: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the image should be floated to the left.
             */
            left: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the image should be floated to the right.
             */
            right: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the image should be centered.
             */
            center: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedWidth: function computedWidth() {
                return parseInt(this.width, 10) || null
            },
            computedHeight: function computedHeight() {
                return parseInt(this.height, 10) || null
            },
            computedAlign: function computedAlign() {
                if (this.center) {
                    return 'mx-auto'
                }

                if (this.left) {
                    return 'float-left'
                }

                if (this.right) {
                    return 'float-right'
                }
            }
        }
    };

    /* script */
                var __vue_script__$B = script$B;
                
    /* template */
    var __vue_render__$B = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("img", {
        class: [
          _vm.thumbnail ? "img-thumbnail" : "",
          _vm.fluid || _vm.fluidGrow ? "img-fluid" : "",
          _vm.fluidGrow ? "w-100" : "",
          _vm.rounded ? "rounded" : "",
          _vm.center ? "d-block" : "",
          Boolean(_vm.computedAlign) ? _vm.computedAlign : ""
        ],
        attrs: {
          src: _vm.src,
          alt: _vm.alt,
          width: _vm.computedWidth,
          height: _vm.computedHeight
        }
      })
    };
    var __vue_staticRenderFns__$B = [];
    __vue_render__$B._withStripped = true;

      /* style */
      var __vue_inject_styles__$B = undefined;
      /* scoped */
      var __vue_scope_id__$B = undefined;
      /* module identifier */
      var __vue_module_identifier__$B = undefined;
      /* functional template */
      var __vue_is_functional_template__$B = false;
      /* component normalizer */
      function __vue_normalize__$B(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/image/Image.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$B() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$B.styles || (__vue_create_injector__$B.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dImg = __vue_normalize__$B(
        { render: __vue_render__$B, staticRenderFns: __vue_staticRenderFns__$B },
        __vue_inject_styles__$B,
        __vue_script__$B,
        __vue_scope_id__$B,
        __vue_is_functional_template__$B,
        __vue_module_identifier__$B,
        __vue_create_injector__$B,
        undefined
      );

    var components$i = {
        dImg: dImg,
        dImage: dImg
    };

    var VuePlugin$i = {
      install: function install (Vue) {
        registerComponents(Vue, components$i);
      }
    };

    vueUse(VuePlugin$i);

    //
    //
    //
    //
    //
    //

    var script$C = {
        name: 'd-input-group-text',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    };

    /* script */
                var __vue_script__$C = script$C;
                
    /* template */
    var __vue_render__$C = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "input-group-text" },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$C = [];
    __vue_render__$C._withStripped = true;

      /* style */
      var __vue_inject_styles__$C = undefined;
      /* scoped */
      var __vue_scope_id__$C = undefined;
      /* module identifier */
      var __vue_module_identifier__$C = undefined;
      /* functional template */
      var __vue_is_functional_template__$C = false;
      /* component normalizer */
      function __vue_normalize__$C(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/input-group/InputGroupText.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$C() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$C.styles || (__vue_create_injector__$C.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var InputGroupText = __vue_normalize__$C(
        { render: __vue_render__$C, staticRenderFns: __vue_staticRenderFns__$C },
        __vue_inject_styles__$C,
        __vue_script__$C,
        __vue_scope_id__$C,
        __vue_is_functional_template__$C,
        __vue_module_identifier__$C,
        __vue_create_injector__$C,
        undefined
      );

    //

    var script$D = {
        name: 'd-input-group-addon',
        components: {
            InputGroupText: InputGroupText
        },
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The append value.
             */
            append: {
                type: Boolean,
                default: false
            },
            /**
             * The prepend value.
             */
            prepend: {
                type: Boolean,
                default: false
            },
            /**
             * Whether is plain-text, or not.
             */
            isText: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$D = script$D;
                
    /* template */
    var __vue_render__$D = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: ["input-group-" + (_vm.append ? "append" : "prepend")],
          attrs: { id: _vm.id }
        },
        [
          _vm.isText ? _c("InputGroupText", [_vm._t("default")], 2) : _vm._e(),
          _vm._v(" "),
          !_vm.isText ? _vm._t("default") : _vm._e()
        ],
        2
      )
    };
    var __vue_staticRenderFns__$D = [];
    __vue_render__$D._withStripped = true;

      /* style */
      var __vue_inject_styles__$D = undefined;
      /* scoped */
      var __vue_scope_id__$D = undefined;
      /* module identifier */
      var __vue_module_identifier__$D = undefined;
      /* functional template */
      var __vue_is_functional_template__$D = false;
      /* component normalizer */
      function __vue_normalize__$D(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/input-group/InputGroupAddon.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$D() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$D.styles || (__vue_create_injector__$D.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var InputGroupAddon = __vue_normalize__$D(
        { render: __vue_render__$D, staticRenderFns: __vue_staticRenderFns__$D },
        __vue_inject_styles__$D,
        __vue_script__$D,
        __vue_scope_id__$D,
        __vue_is_functional_template__$D,
        __vue_module_identifier__$D,
        __vue_create_injector__$D,
        undefined
      );

    //

    var script$E = {
        name: 'd-input-group',
        components: {
            InputGroupAddon: InputGroupAddon,
            InputGroupText: InputGroupText
        },
        props: {
            /**
             * The element id.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The input group size.
             */
            size: {
                type: String,
                default: null,
                validator: function (v) { return ['sm', 'lg', null].includes(v); }
            },
            /**
             * The prepend value.
             */
            prepend: {
                type: String,
                default: null
            },
            /**
             * The append value.
             */
            append: {
                type: String,
                default: null
            },
            /**
             * Whether it should be seamless, or not.
             */
            seamless: {
                type: Boolean,
                default: false
            },
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        },
        computed: {
            appendIsUsed: function appendIsUsed() {
                return !!this.$slots['append'] || this.append
            },
            prependIsUsed: function prependIsUsed() {
                return !!this.$slots['prepend'] || this.prepend
            }
        }
    };

    /* script */
                var __vue_script__$E = script$E;
                
    /* template */
    var __vue_render__$E = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "input-group",
            this.size ? "input-group-" + this.size : "",
            this.seamless ? "input-group-seamless" : ""
          ],
          attrs: { role: "group", id: _vm.id }
        },
        [
          _vm.prependIsUsed
            ? _c(
                "InputGroupAddon",
                { attrs: { prepend: Boolean(_vm.prepend || _vm.prependIsUsed) } },
                [
                  Boolean(_vm.prepend)
                    ? _c("InputGroupText", {
                        domProps: { innerHTML: _vm._s(_vm.prepend) }
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm._t("prepend")
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _vm._t("default"),
          _vm._v(" "),
          _vm.appendIsUsed
            ? _c(
                "InputGroupAddon",
                { attrs: { append: Boolean(_vm.append || _vm.appendIsUsed) } },
                [
                  Boolean(_vm.append)
                    ? _c("InputGroupText", {
                        domProps: { innerHTML: _vm._s(_vm.append) }
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm._t("append")
                ],
                2
              )
            : _vm._e()
        ],
        2
      )
    };
    var __vue_staticRenderFns__$E = [];
    __vue_render__$E._withStripped = true;

      /* style */
      var __vue_inject_styles__$E = function (inject) {
        if (!inject) { return }
        inject("data-v-7b663d44_0", { source: "\n.input-group input:focus {\n    position: relative;\n    z-index: 3;\n}\n\n/* Adjust dropdowns inside input groups. */\n.input-group > .input-group-prepend > .d-dropdown > .btn {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.input-group > .input-group-append > .d-dropdown > .btn {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n/* Datepickers */\n.vdp-datepicker:not(:last-child) input {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.vdp-datepicker:not(:first-child) input {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.vdp-datepicker + .vdp-datepicker {\n    margin-left: -1px;\n}\n.input-group-sm .vdp-datepicker input {\n    height: 1.9375rem;\n    font-size: 0.875rem;\n    line-height: 1.5;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/input-group/InputGroup.vue"],"names":[],"mappings":";AAwFA;IACA,mBAAA;IACA,WAAA;CACA;;AAEA,2CAAA;AACA;IACA,2BAAA;IACA,8BAAA;CACA;AAEA;IACA,0BAAA;IACA,6BAAA;CACA;;AAEA,iBAAA;AACA;IACA,2BAAA;IACA,8BAAA;CACA;AAEA;IACA,0BAAA;IACA,6BAAA;CACA;AAEA;IACA,kBAAA;CACA;AAEA;IACA,kBAAA;IACA,oBAAA;IACA,iBAAA;CACA","file":"InputGroup.vue","sourcesContent":["<template>\n    <component :is=\"tag\"\n        role=\"group\"\n        :id=\"id\"\n        :class=\"[\n            'input-group',\n            this.size ? `input-group-${this.size}` : '',\n            this.seamless ? 'input-group-seamless' : ''\n        ]\">\n        <InputGroupAddon v-if=\"prependIsUsed\" :prepend=\"Boolean(prepend || prependIsUsed)\">\n            <InputGroupText v-if=\"Boolean(prepend)\" v-html=\"prepend\"  />\n            <slot name=\"prepend\" />\n        </InputGroupAddon>\n        <slot />\n        <InputGroupAddon v-if=\"appendIsUsed\" :append=\"Boolean(append || appendIsUsed)\">\n            <InputGroupText v-if=\"Boolean(append)\" v-html=\"append\" />\n            <slot name=\"append\" />\n        </InputGroupAddon>\n    </component>\n</template>\n\n<script>\nimport InputGroupAddon from './InputGroupAddon.vue'\nimport InputGroupText from './InputGroupText.vue'\n\nexport default {\n    name: 'd-input-group',\n    components: {\n        InputGroupAddon,\n        InputGroupText\n    },\n    props: {\n        /**\n         * The element id.\n         */\n        id: {\n            type: String,\n            default: null\n        },\n        /**\n         * The input group size.\n         */\n        size: {\n            type: String,\n            default: null,\n            validator: v => ['sm', 'lg', null].includes(v)\n        },\n        /**\n         * The prepend value.\n         */\n        prepend: {\n            type: String,\n            default: null\n        },\n        /**\n         * The append value.\n         */\n        append: {\n            type: String,\n            default: null\n        },\n        /**\n         * Whether it should be seamless, or not.\n         */\n        seamless: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The element tag.\n         */\n        tag: {\n            type: String,\n            default: 'div'\n        }\n    },\n    computed: {\n        appendIsUsed() {\n            return !!this.$slots['append'] || this.append\n        },\n        prependIsUsed() {\n            return !!this.$slots['prepend'] || this.prepend\n        }\n    }\n}\n</script>\n\n<style>\n.input-group input:focus {\n    position: relative;\n    z-index: 3;\n}\n\n/* Adjust dropdowns inside input groups. */\n.input-group > .input-group-prepend > .d-dropdown > .btn {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n\n.input-group > .input-group-append > .d-dropdown > .btn {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n/* Datepickers */\n.vdp-datepicker:not(:last-child) input {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n\n.vdp-datepicker:not(:first-child) input {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n.vdp-datepicker + .vdp-datepicker {\n    margin-left: -1px;\n}\n\n.input-group-sm .vdp-datepicker input {\n    height: 1.9375rem;\n    font-size: 0.875rem;\n    line-height: 1.5;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$E = undefined;
      /* module identifier */
      var __vue_module_identifier__$E = undefined;
      /* functional template */
      var __vue_is_functional_template__$E = false;
      /* component normalizer */
      function __vue_normalize__$E(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/input-group/InputGroup.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$E() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$E.styles || (__vue_create_injector__$E.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dInputGroup = __vue_normalize__$E(
        { render: __vue_render__$E, staticRenderFns: __vue_staticRenderFns__$E },
        __vue_inject_styles__$E,
        __vue_script__$E,
        __vue_scope_id__$E,
        __vue_is_functional_template__$E,
        __vue_module_identifier__$E,
        __vue_create_injector__$E,
        undefined
      );

    var components$j = {
        dInputGroup: dInputGroup,
        dInputGroupText: InputGroupText,
        dInputGroupAddon: InputGroupAddon
    };

    var VuePlugin$j = {
      install: function install (Vue) {
        registerComponents(Vue, components$j);
      }
    };

    vueUse(VuePlugin$j);

    var components$k = {
        dLink: dLink
    };

    var VuePlugin$k = {
      install: function install (Vue) {
        registerComponents(Vue, components$k);
      }
    };

    vueUse(VuePlugin$k);

    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$F = {
        name: 'd-list-group',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether the list group should be flushed, or not.
             */
            flush: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$F = script$F;
                
    /* template */
    var __vue_render__$F = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: ["list-group", _vm.flush ? "list-group-flush" : ""]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$F = [];
    __vue_render__$F._withStripped = true;

      /* style */
      var __vue_inject_styles__$F = undefined;
      /* scoped */
      var __vue_scope_id__$F = undefined;
      /* module identifier */
      var __vue_module_identifier__$F = undefined;
      /* functional template */
      var __vue_is_functional_template__$F = false;
      /* component normalizer */
      function __vue_normalize__$F(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/list-group/ListGroup.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$F() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$F.styles || (__vue_create_injector__$F.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dListGroup = __vue_normalize__$F(
        { render: __vue_render__$F, staticRenderFns: __vue_staticRenderFns__$F },
        __vue_inject_styles__$F,
        __vue_script__$F,
        __vue_scope_id__$F,
        __vue_is_functional_template__$F,
        __vue_module_identifier__$F,
        __vue_create_injector__$F,
        undefined
      );

    //

    var _linkProps = createLinkProps();

    if (_linkProps && typeof _linkProps.href !== 'undefined') {
        delete _linkProps.href.default;
    }

    if (_linkProps && typeof _linkProps.to !== 'undefined') {
        delete _linkProps.to.default;
    }

    var _actionTags = ['a', 'router-link', 'button', 'd-link'];

    /**
     * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
     */
    var script$G = {
        name: 'd-list-group-item',
        components: {
            dLink: dLink
        },
        props: Object.assign({}, _linkProps, {
                /**
                 * The element tag.
                 */
                tag: {
                    type: String,
                    default: 'div'
                },
                /**
                 * The element action.
                 */
                action: {
                    type: Boolean,
                    default: null
                },
                /**
                 * Whether the element tag should be a button, or not.
                 */
                button: {
                    type: Boolean,
                    default: null
                },
                /**
                 * The theme color.
                 */
                theme: {
                    type: String,
                    default: null,
                    validator: function (v) { return THEMECOLORS.includes(v); }
                }
            }),
        computed: {
            computedTag: function computedTag() {
                var _tagOrLink = ((!this.href && !this.to) ? this.tag : 'd-link');
                return this.button ? 'button' : _tagOrLink
            },
            isAction: function isAction() {
                return Boolean(
                    this.href
                    || this.to
                    || this.action
                    || this.button
                    || _actionTags.includes(this.tag)
                )
            }
        }
    };

    /* script */
                var __vue_script__$G = script$G;
                
    /* template */
    var __vue_render__$G = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.computedTag,
        {
          tag: "component",
          class: [
            "list-group-item",
            _vm.theme ? "list-group-item-" + _vm.theme : "",
            _vm.isAction ? "list-group-item-action" : "",
            _vm.active ? "active" : "",
            _vm.disabled ? "disabled" : ""
          ],
          attrs: { disabled: _vm.button && _vm.disabled }
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$G = [];
    __vue_render__$G._withStripped = true;

      /* style */
      var __vue_inject_styles__$G = undefined;
      /* scoped */
      var __vue_scope_id__$G = undefined;
      /* module identifier */
      var __vue_module_identifier__$G = undefined;
      /* functional template */
      var __vue_is_functional_template__$G = false;
      /* component normalizer */
      function __vue_normalize__$G(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/list-group/ListGroupItem.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$G() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$G.styles || (__vue_create_injector__$G.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dListGroupItem = __vue_normalize__$G(
        { render: __vue_render__$G, staticRenderFns: __vue_staticRenderFns__$G },
        __vue_inject_styles__$G,
        __vue_script__$G,
        __vue_scope_id__$G,
        __vue_is_functional_template__$G,
        __vue_module_identifier__$G,
        __vue_create_injector__$G,
        undefined
      );

    var components$l = {
        dListGroup: dListGroup,
        dListGroupItem: dListGroupItem
    };

    var VuePlugin$l = {
      install: function install (Vue) {
        registerComponents(Vue, components$l);
      }
    };

    vueUse(VuePlugin$l);

    //

    var script$H = {
        name: 'd-modal',
        mixins: [vueClickaway.mixin],
        props: {
            /**
             * The component tag.
             */
            tag: {
                type: String,
                default: "div"
            },
            /**
             * The size (sm, lg).
             */
            size: {
                type: String,
                default: null,
                validator: function (v) { return ['sm', 'lg'].includes(v); }
            },
            /**
             * Hides the backdrop overlay.
             */
            noBackdrop: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it is centered, or not.
             */
            centered: {
                type: Boolean,
                default: false
            }
        },
      methods: {
        away: function away() {
            if (this.noBackdrop) {
                return;
            }

            /**
             * @event close
             *
             * Triggered when the modal is closed.
             */
            this.$emit('close');

            /**
             * @event hidden
             *
             * Triggered when the modal is hidden.
             */
            this.$root.$emit(MODAL_EVENTS.HIDDEN);
        }
      },
    };

    /* script */
                var __vue_script__$H = script$H;
                
    /* template */
    var __vue_render__$H = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "transition",
        { attrs: { name: "fade" } },
        [
          _c(
            _vm.tag,
            {
              tag: "component",
              class: ["modal", this.noBackdrop ? "modal--no-backdrop" : ""]
            },
            [
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "on-clickaway",
                      rawName: "v-on-clickaway",
                      value: _vm.away,
                      expression: "away"
                    }
                  ],
                  class: [
                    "modal-dialog",
                    _vm.size ? "modal-" + _vm.size : "",
                    _vm.centered ? "modal-dialog-centered" : ""
                  ],
                  attrs: { role: "document" }
                },
                [
                  _c(
                    "div",
                    { staticClass: "modal-content" },
                    [_vm._t("default")],
                    2
                  )
                ]
              )
            ]
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$H = [];
    __vue_render__$H._withStripped = true;

      /* style */
      var __vue_inject_styles__$H = function (inject) {
        if (!inject) { return }
        inject("data-v-37df0aa6_0", { source: "\n.modal[data-v-37df0aa6] {\n    display: block;\n    background-color: rgba(0,0,0,0.5);\n    transition: .3s;\n    overflow-y: auto;\n}\n.modal-dialog[data-v-37df0aa6] {\n    transition: .3s;\n}\n.modal--no-backdrop[data-v-37df0aa6] {\n    background: none;\n    pointer-events: none;\n}\n.fade-enter[data-v-37df0aa6] {\n    transform: translate(0,0);\n    opacity: 1;\n}\n.fade-leave-active[data-v-37df0aa6] {\n    transform: translate(0,0);\n    opacity: 1;\n}\n.fade-enter[data-v-37df0aa6], .fade-leave-active[data-v-37df0aa6] {\n    opacity: 0;\n}\n.fade-enter .modal-dialog[data-v-37df0aa6],\n.fade-leave-active .modal-dialog[data-v-37df0aa6] {\n    -webkit-transform: translate(0,-25%);\n    transform: translate(0,-25%);\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/modal/Modal.vue"],"names":[],"mappings":";AAqFA;IACA,eAAA;IACA,kCAAA;IACA,gBAAA;IACA,iBAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,iBAAA;IACA,qBAAA;CACA;AAEA;IACA,0BAAA;IACA,WAAA;CACA;AAEA;IACA,0BAAA;IACA,WAAA;CACA;AAEA;IACA,WAAA;CACA;AAEA;;IAEA,qCAAA;IACA,6BAAA;CACA","file":"Modal.vue","sourcesContent":["<template>\n  <transition name=\"fade\">\n    <component :is=\"tag\"\n        :class=\"[\n            'modal',\n            this.noBackdrop ? 'modal--no-backdrop' : ''\n        ]\">\n      <div :class=\"[\n            'modal-dialog',\n            size ? `modal-${size}` : '',\n            centered ? `modal-dialog-centered` : '',\n        ]\"\n        role=\"document\"\n        v-on-clickaway=\"away\">\n        <div class=\"modal-content\">\n            <slot />\n        </div>\n      </div>\n    </component>\n  </transition>\n</template>\n\n<script>\nimport { mixin as clickAwayMixin } from 'vue-clickaway';\nimport { MODAL_EVENTS } from '../../utils/constants';\n\nexport default {\n    name: 'd-modal',\n    mixins: [clickAwayMixin],\n    props: {\n        /**\n         * The component tag.\n         */\n        tag: {\n            type: String,\n            default: \"div\"\n        },\n        /**\n         * The size (sm, lg).\n         */\n        size: {\n            type: String,\n            default: null,\n            validator: v => ['sm', 'lg'].includes(v)\n        },\n        /**\n         * Hides the backdrop overlay.\n         */\n        noBackdrop: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether it is centered, or not.\n         */\n        centered: {\n            type: Boolean,\n            default: false\n        }\n    },\n  methods: {\n    away() {\n        if (this.noBackdrop) {\n            return;\n        }\n\n        /**\n         * @event close\n         *\n         * Triggered when the modal is closed.\n         */\n        this.$emit('close');\n\n        /**\n         * @event hidden\n         *\n         * Triggered when the modal is hidden.\n         */\n        this.$root.$emit(MODAL_EVENTS.HIDDEN)\n    }\n  },\n};\n</script>\n\n<style scoped>\n.modal {\n    display: block;\n    background-color: rgba(0,0,0,0.5);\n    transition: .3s;\n    overflow-y: auto;\n}\n\n.modal-dialog {\n    transition: .3s;\n}\n\n.modal--no-backdrop {\n    background: none;\n    pointer-events: none;\n}\n\n.fade-enter {\n    transform: translate(0,0);\n    opacity: 1;\n}\n\n.fade-leave-active {\n    transform: translate(0,0);\n    opacity: 1;\n}\n\n.fade-enter, .fade-leave-active {\n    opacity: 0;\n}\n\n.fade-enter .modal-dialog,\n.fade-leave-active .modal-dialog {\n    -webkit-transform: translate(0,-25%);\n    transform: translate(0,-25%);\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$H = "data-v-37df0aa6";
      /* module identifier */
      var __vue_module_identifier__$H = undefined;
      /* functional template */
      var __vue_is_functional_template__$H = false;
      /* component normalizer */
      function __vue_normalize__$H(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/modal/Modal.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$H() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$H.styles || (__vue_create_injector__$H.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dModal = __vue_normalize__$H(
        { render: __vue_render__$H, staticRenderFns: __vue_staticRenderFns__$H },
        __vue_inject_styles__$H,
        __vue_script__$H,
        __vue_scope_id__$H,
        __vue_is_functional_template__$H,
        __vue_module_identifier__$H,
        __vue_create_injector__$H,
        undefined
      );

    //

    var script$I = {
        name: 'd-modal-header',
        components: {
            dBtnClose: dBtnClose
        },
        props: {
            /**
             * The component's tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether to display the close button, or not.
             */
            close: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            away: function away() {
                this.$parent.$emit('close');
            }
        }
    };

    /* script */
                var __vue_script__$I = script$I;
                
    /* template */
    var __vue_render__$I = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "modal-header" },
        [
          _vm._t("default"),
          _vm._v(" "),
          _vm.close
            ? _c("d-btn-close", {
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.away($event)
                  }
                }
              })
            : _vm._e()
        ],
        2
      )
    };
    var __vue_staticRenderFns__$I = [];
    __vue_render__$I._withStripped = true;

      /* style */
      var __vue_inject_styles__$I = undefined;
      /* scoped */
      var __vue_scope_id__$I = undefined;
      /* module identifier */
      var __vue_module_identifier__$I = undefined;
      /* functional template */
      var __vue_is_functional_template__$I = false;
      /* component normalizer */
      function __vue_normalize__$I(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/modal/ModalHeader.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$I() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$I.styles || (__vue_create_injector__$I.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dModalHeader = __vue_normalize__$I(
        { render: __vue_render__$I, staticRenderFns: __vue_staticRenderFns__$I },
        __vue_inject_styles__$I,
        __vue_script__$I,
        __vue_scope_id__$I,
        __vue_is_functional_template__$I,
        __vue_module_identifier__$I,
        __vue_create_injector__$I,
        undefined
      );

    //
    //
    //
    //
    //
    //

    var script$J = {
        name: 'd-modal-title',
        props: {
            /**
             * The component's tag.
             */
            tag: {
                type: String,
                default: 'h5'
            }
        }
    };

    /* script */
                var __vue_script__$J = script$J;
                
    /* template */
    var __vue_render__$J = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "modal-title" },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$J = [];
    __vue_render__$J._withStripped = true;

      /* style */
      var __vue_inject_styles__$J = undefined;
      /* scoped */
      var __vue_scope_id__$J = undefined;
      /* module identifier */
      var __vue_module_identifier__$J = undefined;
      /* functional template */
      var __vue_is_functional_template__$J = false;
      /* component normalizer */
      function __vue_normalize__$J(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/modal/ModalTitle.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$J() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$J.styles || (__vue_create_injector__$J.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dModalTitle = __vue_normalize__$J(
        { render: __vue_render__$J, staticRenderFns: __vue_staticRenderFns__$J },
        __vue_inject_styles__$J,
        __vue_script__$J,
        __vue_scope_id__$J,
        __vue_is_functional_template__$J,
        __vue_module_identifier__$J,
        __vue_create_injector__$J,
        undefined
      );

    //
    //
    //
    //
    //
    //

    var script$K = {
        name: 'd-modal-body',
        props: {
            /**
             * The component's tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    };

    /* script */
                var __vue_script__$K = script$K;
                
    /* template */
    var __vue_render__$K = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "modal-body" },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$K = [];
    __vue_render__$K._withStripped = true;

      /* style */
      var __vue_inject_styles__$K = undefined;
      /* scoped */
      var __vue_scope_id__$K = undefined;
      /* module identifier */
      var __vue_module_identifier__$K = undefined;
      /* functional template */
      var __vue_is_functional_template__$K = false;
      /* component normalizer */
      function __vue_normalize__$K(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/modal/ModalBody.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$K() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$K.styles || (__vue_create_injector__$K.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dModalBody = __vue_normalize__$K(
        { render: __vue_render__$K, staticRenderFns: __vue_staticRenderFns__$K },
        __vue_inject_styles__$K,
        __vue_script__$K,
        __vue_scope_id__$K,
        __vue_is_functional_template__$K,
        __vue_module_identifier__$K,
        __vue_create_injector__$K,
        undefined
      );

    //
    //
    //
    //
    //
    //

    var script$L = {
        name: 'd-modal-footer',
        props: {
            /**
             * The component's tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    };

    /* script */
                var __vue_script__$L = script$L;
                
    /* template */
    var __vue_render__$L = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        { tag: "component", staticClass: "modal-footer" },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$L = [];
    __vue_render__$L._withStripped = true;

      /* style */
      var __vue_inject_styles__$L = undefined;
      /* scoped */
      var __vue_scope_id__$L = undefined;
      /* module identifier */
      var __vue_module_identifier__$L = undefined;
      /* functional template */
      var __vue_is_functional_template__$L = false;
      /* component normalizer */
      function __vue_normalize__$L(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/modal/ModalFooter.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$L() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$L.styles || (__vue_create_injector__$L.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dModalFooter = __vue_normalize__$L(
        { render: __vue_render__$L, staticRenderFns: __vue_staticRenderFns__$L },
        __vue_inject_styles__$L,
        __vue_script__$L,
        __vue_scope_id__$L,
        __vue_is_functional_template__$L,
        __vue_module_identifier__$L,
        __vue_create_injector__$L,
        undefined
      );

    var components$m = {
        dModal: dModal,
        dModalHeader: dModalHeader,
        dModalTitle: dModalTitle,
        dModalBody: dModalBody,
        dModalFooter: dModalFooter
    };

    var VuePlugin$m = {
      install: function install (Vue) {
        registerComponents(Vue, components$m);
      }
    };

    vueUse(VuePlugin$m);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$M = {
        name: 'd-nav',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'ul'
            },
            /**
             * Fill all available space.
             */
            fill: {
                type: Boolean,
                default: false
            },
            /**
             * Define equal width elements.
             */
            justified: {
                type: Boolean,
                default: false
            },
            /**
             * Display as tabs.
             */
            tabs: {
                type: Boolean,
                default: false
            },
            /**
             * Display as pills.
             */
            pills: {
                type: Boolean,
                default: false
            },
            /**
             * Display vertical.
             */
            vertical: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$M = script$M;
                
    /* template */
    var __vue_render__$M = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "nav",
            _vm.tabs ? "nav-tabs" : "",
            _vm.pills ? "nav-pills" : "",
            _vm.vertical ? "flex-column" : "",
            _vm.fill ? "nav-fill" : "",
            _vm.justified ? "nav-justified" : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$M = [];
    __vue_render__$M._withStripped = true;

      /* style */
      var __vue_inject_styles__$M = undefined;
      /* scoped */
      var __vue_scope_id__$M = undefined;
      /* module identifier */
      var __vue_module_identifier__$M = undefined;
      /* functional template */
      var __vue_is_functional_template__$M = false;
      /* component normalizer */
      function __vue_normalize__$M(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/nav/Nav.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$M() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$M.styles || (__vue_create_injector__$M.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dNav = __vue_normalize__$M(
        { render: __vue_render__$M, staticRenderFns: __vue_staticRenderFns__$M },
        __vue_inject_styles__$M,
        __vue_script__$M,
        __vue_scope_id__$M,
        __vue_is_functional_template__$M,
        __vue_module_identifier__$M,
        __vue_create_injector__$M,
        undefined
      );

    //

    /**
     * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
     */
    var script$N = {
        name: 'd-nav-item',
        components: {
            dLink: dLink
        },
        props: createLinkProps()
    };

    /* script */
                var __vue_script__$N = script$N;
                
    /* template */
    var __vue_render__$N = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "li",
        { staticClass: "nav-item" },
        [
          _c(
            "d-link",
            _vm._b({ staticClass: "nav-link" }, "d-link", _vm.$props, false),
            [_vm._t("default")],
            2
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$N = [];
    __vue_render__$N._withStripped = true;

      /* style */
      var __vue_inject_styles__$N = undefined;
      /* scoped */
      var __vue_scope_id__$N = undefined;
      /* module identifier */
      var __vue_module_identifier__$N = undefined;
      /* functional template */
      var __vue_is_functional_template__$N = false;
      /* component normalizer */
      function __vue_normalize__$N(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/nav/NavItem.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$N() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$N.styles || (__vue_create_injector__$N.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dNavItem = __vue_normalize__$N(
        { render: __vue_render__$N, staticRenderFns: __vue_staticRenderFns__$N },
        __vue_inject_styles__$N,
        __vue_script__$N,
        __vue_scope_id__$N,
        __vue_is_functional_template__$N,
        __vue_module_identifier__$N,
        __vue_create_injector__$N,
        undefined
      );

    var components$n = {
        dNav: dNav,
        dNavItem: dNavItem
    };

    var VuePlugin$n = {
      install: function install (Vue) {
        registerComponents(Vue, components$n);
      }
    };

    vueUse(VuePlugin$n);

    //

    var script$O = {
        name: 'd-navbar',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'nav'
            },
            /**
             * The navbar type.
             */
            type: {
                type: String,
                default: 'light'
            },
            /**
             * The theme color.
             */
            theme: {
                type: String,
                validator: function (v) { return THEMECOLORS.includes(v); }
            },
            /**
             * Whether the navbar is toggleable, or not. Also accepts String for breakpoint definition.
             */
            toggleable: {
                type: [String, Boolean],
                default: false
            },
            /**
             * Fix the navbar to either `top` or `bottom`.
             */
            fixed: {
                type: String
            },
            /**
             * Whether the navbar should be sticky.
             */
            sticky: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$O = script$O;
                
    /* template */
    var __vue_render__$O = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "navbar",
            _vm.type ? "navbar-" + _vm.type : "",
            _vm.theme ? "bg-" + _vm.theme : "",
            _vm.fixed ? "fixed-" + _vm.fixed : "",
            _vm.sticky ? "sticky-top" : "",
            _vm.toggleable
              ? "navbar-expand-" +
                ((_vm.toggleable ? "sm" : _vm.toggleable) || "sm")
              : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$O = [];
    __vue_render__$O._withStripped = true;

      /* style */
      var __vue_inject_styles__$O = undefined;
      /* scoped */
      var __vue_scope_id__$O = undefined;
      /* module identifier */
      var __vue_module_identifier__$O = undefined;
      /* functional template */
      var __vue_is_functional_template__$O = false;
      /* component normalizer */
      function __vue_normalize__$O(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/navbar/Navbar.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$O() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$O.styles || (__vue_create_injector__$O.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dNavbar = __vue_normalize__$O(
        { render: __vue_render__$O, staticRenderFns: __vue_staticRenderFns__$O },
        __vue_inject_styles__$O,
        __vue_script__$O,
        __vue_scope_id__$O,
        __vue_is_functional_template__$O,
        __vue_module_identifier__$O,
        __vue_create_injector__$O,
        undefined
      );

    //

    /**
     * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
     */
    var script$P = {
        name: 'd-navbar-brand',
        components: {
            dLink: dLink
        },
        props: Object.assign({}, createLinkProps(), {
                /**
                 * The element tag.
                 */
                tag: {
                    type: String,
                    default: 'div'
                }
            }),
        computed: {
            computedTag: function computedTag() {
                // eslint-disable-next-line
                return Boolean(this.to || this.href) ? 'd-link' : this.tag
            },
            computedProps: function computedProps() {
                // eslint-disable-next-line
                return Boolean(this.to || this.href) ? this.$props : {}
            }
        }
    };

    /* script */
                var __vue_script__$P = script$P;
                
    /* template */
    var __vue_render__$P = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.computedTag,
        _vm._b({ tag: "component" }, "component", _vm.computedProps, false),
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$P = [];
    __vue_render__$P._withStripped = true;

      /* style */
      var __vue_inject_styles__$P = undefined;
      /* scoped */
      var __vue_scope_id__$P = undefined;
      /* module identifier */
      var __vue_module_identifier__$P = undefined;
      /* functional template */
      var __vue_is_functional_template__$P = false;
      /* component normalizer */
      function __vue_normalize__$P(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/navbar/NavbarBrand.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$P() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$P.styles || (__vue_create_injector__$P.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dNavbarBrand = __vue_normalize__$P(
        { render: __vue_render__$P, staticRenderFns: __vue_staticRenderFns__$P },
        __vue_inject_styles__$P,
        __vue_script__$P,
        __vue_scope_id__$P,
        __vue_is_functional_template__$P,
        __vue_module_identifier__$P,
        __vue_create_injector__$P,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$Q = {
        name: 'd-navbar-nav',
        props: {
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'ul'
            },
            /**
             * Whether it should fill the entire space, or not.
             */
            fill: {
                type: Boolean,
                default: false
            },
            /**
             * Whether to proportionally fill all abailable space, or not.
             */
            justified: {
                type: Boolean,
                default: false
            }
        }
    };

    /* script */
                var __vue_script__$Q = script$Q;
                
    /* template */
    var __vue_render__$Q = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: [
            "navbar-nav",
            _vm.fill ? "nav-fill" : "",
            _vm.justified ? "nav-justified" : ""
          ]
        },
        [_vm._t("default")],
        2
      )
    };
    var __vue_staticRenderFns__$Q = [];
    __vue_render__$Q._withStripped = true;

      /* style */
      var __vue_inject_styles__$Q = undefined;
      /* scoped */
      var __vue_scope_id__$Q = undefined;
      /* module identifier */
      var __vue_module_identifier__$Q = undefined;
      /* functional template */
      var __vue_is_functional_template__$Q = false;
      /* component normalizer */
      function __vue_normalize__$Q(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/navbar/NavbarNav.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$Q() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$Q.styles || (__vue_create_injector__$Q.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dNavbarNav = __vue_normalize__$Q(
        { render: __vue_render__$Q, staticRenderFns: __vue_staticRenderFns__$Q },
        __vue_inject_styles__$Q,
        __vue_script__$Q,
        __vue_scope_id__$Q,
        __vue_is_functional_template__$Q,
        __vue_module_identifier__$Q,
        __vue_create_injector__$Q,
        undefined
      );

    //

    var script$R = {
        name: 'd-navbar-toggle',
        mixins: [ rootListenerMixin ],
        data: function data() {
            return {
                toggleState: false
            }
        },
        props: {
            /**
             * The label value.
             */
            label: {
                type: String,
                default: 'Toggle navigation'
            },
            /**
             * The toggle target.
             */
            target: {
                type: String,
                required: true
            }
        },
        methods: {
            onClick: function onClick() {
                this.$root.$emit(COLLAPSE_EVENTS.TOGGLE, this.target);
            },
            handleStateEvent: function handleStateEvent(id, state) {
                if (id === this.target) {
                    this.toggleState = state;
                }
            }
        },
        created: function created() {
            this.listenOnRoot(COLLAPSE_EVENTS.STATE, this.handleStateEvent);
        }
    };

    /* script */
                var __vue_script__$R = script$R;
                
    /* template */
    var __vue_render__$R = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "button",
        {
          staticClass: "navbar-toggler",
          attrs: {
            "aria-label": _vm.label,
            "aria-controls": _vm.target,
            "aria-expanded": _vm.toggleState ? "true" : "false"
          },
          on: { click: _vm.onClick }
        },
        [_vm._t("default", [_c("span", { staticClass: "navbar-toggler-icon" })])],
        2
      )
    };
    var __vue_staticRenderFns__$R = [];
    __vue_render__$R._withStripped = true;

      /* style */
      var __vue_inject_styles__$R = undefined;
      /* scoped */
      var __vue_scope_id__$R = undefined;
      /* module identifier */
      var __vue_module_identifier__$R = undefined;
      /* functional template */
      var __vue_is_functional_template__$R = false;
      /* component normalizer */
      function __vue_normalize__$R(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/navbar/NavbarToggle.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$R() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$R.styles || (__vue_create_injector__$R.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dNavbarToggle = __vue_normalize__$R(
        { render: __vue_render__$R, staticRenderFns: __vue_staticRenderFns__$R },
        __vue_inject_styles__$R,
        __vue_script__$R,
        __vue_scope_id__$R,
        __vue_is_functional_template__$R,
        __vue_module_identifier__$R,
        __vue_create_injector__$R,
        undefined
      );

    var components$o = {
        dNavbar: dNavbar,
        dNavbarBrand: dNavbarBrand,
        dNavbarNav: dNavbarNav,
        dNavbarToggle: dNavbarToggle
    };

    var VuePlugin$o = {
      install: function install (Vue) {
        registerComponents(Vue, components$o);
      }
    };

    vueUse(VuePlugin$o);

    var Defaults$1 = {
        animation: true,
        template: '',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        placement: 'top',
        offset: 0,
        arrowPadding: 6,
        container: false,
        fallbackPlacement: 'flip',
        callbacks: {},
        boundary: 'scrollParent'
    };

    var TransitionEndEvents = {
      WebkitTransition: ['webkitTransitionEnd'],
      MozTransition: ['transitionend'],
      OTransition: ['otransitionend', 'oTransitionEnd'],
      transition: ['transitionend']
    };

    var MODAL_CLASS = '.modal-content';

    var TPManager = function TPManager(targetElement, config, $root) {
          this._config = null;
          this._isEnabled = true;
          this._fadeTimeout = null;
          this._hoverTimeout = null;
          this._visibleInterval = null;
          this._hoverState = '';
          this._activeTrigger = {};
          this._popperInstance = null;
          this._targetElement = targetElement;
          this._TPElement = null;
          this._id = guid();
          this._$root = $root || null;
          this._routeWatcher = null;

          this.updateConfig(config);
      };

    var staticAccessors = { Defaults: { configurable: true } };

      staticAccessors.Defaults.get = function () {
          return Defaults$1
      };

      TPManager.getPlacement = function getPlacement (placement) {
          return N_TP_PLACEMENTS[placement.toUpperCase()]
      };

      /*--------------------------------------------------------------------------
      /* PUBLIC
      /*--------------------------------------------------------------------------*/

      TPManager.prototype.updateConfig = function updateConfig (config) {
          var updatedConfig = Object.assign({}, this.constructor.Defaults, config);

          if (config.delay && typeof config.delay === 'number') {
              updatedConfig.delay = {
                  show: config.delay,
                  hide: config.delay
              };
          }

          ['title', 'content'].forEach(function (part) {
              if (config[part] && typeof config[part] === 'number') {
                  updatedConfig[part] = config[part].toString();
              }
          });

          this._config = updatedConfig;

          this._updateTitleAttributes();
          this._removeEventListeners();
          this._addEventListeners();
      };

      TPManager.prototype.show = function show () {
            var this$1 = this;

          if (!document.body.contains(this._targetElement) || !isVisible(this._targetElement)) {
              return
          }

          var TPElement = this._getElement();
          this._updateTitleAttributes();
          this.setContent(TPElement);

          // Don't show if there's no content
          if (!this.hasContent(TPElement)) {
              this._TPElement = null;
              return
          }

          // Set the ID on the TP element
          setAttr(TPElement, 'id', this._id);

          // Set the aria-describedby attribute on the target element
          var desc = getAttr(this._targetElement, 'aria-describedby') || '';
          desc = desc.split(/\s+/).concat(this._id).join(' ').trim();
          setAttr(this._targetElement, 'aria-describedby', desc);

          // Set animations
          if (this._config.animation) {
              addClass(TPElement, TP_STATE_CLASSES.FADE);
          } else {
              removeClass(TPElement, TP_STATE_CLASSES.FADE);
          }

          // Process placement
          var placement = this._config.placement;

          if (typeof placement === 'function') {
              placement = placement.call(this, this._TPElement, this._targetElement);
          }

          var attachment = this.constructor.getPlacement(placement);
          this._addPlacementClass(attachment);

          // Emit and process a custom event
          var _showEvent = new CancelableEvent('show', {
              cancelable: true,
              target: this._targetElement,
              relatedTarget: TPElement
          });

          this._emitCustomEvent(_showEvent);

          if (_showEvent.defaultPrevented) {
              this._TPElement = null;
              return
          }

          // Append the TP element to the container
          var container = this._getContainer();
          if (!document.body.contains(TPElement)) {
              container.appendChild(TPElement);
          }

          // Reinitialize Popper
          this._removePopper();
          this._popperInstance = new Popper(this._targetElement, TPElement, this._getPopperConfig(placement, TPElement));

          // Prep the transition complete handler
          var _transitionCompleteHandler = function () {
              if (this$1._config.animation) {
                  var initConfigAnimation = this$1._config.animation || false;

                  if (getAttr(TPElement, 'x-placement') !== null) {
                      return
                  }

                  removeClass(TPElement, TP_STATE_CLASSES.FADE);
                  this$1._config.animation = false;
                  this$1.hide();
                  this$1.show();
                  this$1._config.animation = initConfigAnimation;
              }

              var prevHoverState = this$1._hoverState;
              this$1._hoverState = null;

              if (prevHoverState === TOOLTIP_HOVER_STATE_CLASSES.OUT) {
                  this$1._handleLeave(null);
              }

              var shownEvt = new CancelableEvent('shown', {
                  cancelable: false,
                  target: this$1._targetElement,
                  relatedTarget: TPElement
              });

              this$1._emitCustomEvent(shownEvt);
          };

          // Enable edge case listeners
          this._handleEdgeCases(true);
          addClass(TPElement, TP_STATE_CLASSES.SHOW);
          this._transitionOnce(TPElement, _transitionCompleteHandler);
      };

      TPManager.prototype.hide = function hide (callbackFn, force) {
            var this$1 = this;

          var TPElement = this._TPElement;

          if (!TPElement) {
              return
          }

          var hideEvent = new CancelableEvent('hide', {
              cancelable: !force,
              target: this._targetElement,
              relatedTarget: TPElement
          });

          this._emitCustomEvent(hideEvent);

          // Don't hide if the custom event is cancelled
          if (hideEvent.defaultPrevented) {
              return
          }

          // Disable edge case listeners
          this._handleEdgeCases(false);

          if (force) {
              removeClass(TPElement, TP_STATE_CLASSES.FADE);
          }

          removeClass(TPElement, TP_STATE_CLASSES.SHOW);

          // Update active trigger flags
          this._activeTrigger.click = false;
          this._activeTrigger.focus = false;
          this._activeTrigger.hover = false;

          var _transitionCompleteHandler = function () {
              if (this$1._hoverState !== TOOLTIP_HOVER_STATE_CLASSES.SHOW && TPElement.parentNode) {
                  TPElement.parentNode.removeChild(TPElement);

                  // Remove the `aria-describedby` attribute
                  var desc = getAttr(this$1._targetElement, 'aria-describedby') || '';
                  desc = desc.split(/\s+/).filter(function (d) { return d !== this$1._id; }).join(' ').trim();
                  desc ? setAttr(this$1._targetElement, 'aria-describedby', desc) : removeAttr(this$1._targetElement, 'aria-describedby');

                  // Remove Popper and unset TPElement
                  this$1._removePopper();
                  this$1._TPElement = null;
              }

              // Run the callback function if any.
              if (callbackFn) {
                  callbackFn();
              }

              // Prep and emit custom event
              var _hiddenEvent = new CancelableEvent('hidden', {
                  cancelable: false,
                  target: this$1._targetElement,
                  relatedTarget: null
              });

              this$1._emitCustomEvent(_hiddenEvent);
          };

          this._transitionOnce(TPElement, _transitionCompleteHandler);
          this._hoverState = '';
      };

      TPManager.prototype.destroy = function destroy () {
          this._removeEventListeners();
          this._handleEdgeCases(false);

          clearTimeout(this._hoverTimeout);
          clearTimeout(this._fadeTimeout);

          if (this._popperInstance) {
              this._popperInstance.destroy();
          }

          if (this._TPElement && this._TPElement.parentElement) {
              this._TPElement.parentElement.removeChild(this._TPElement);
          }

          this._hoverTimeout = null;
          this._fadeTimeout = null;
          this._popperInstance = null;
          this._TPElement = null;
          this._id = null;
          this._$root = null;
          this._isEnabled = true;
          this._hoverState = null;
          this._activeTrigger = null;
          this._targetElement = null;
      };

      TPManager.prototype.setElementContent = function setElementContent (container, content) {
          if (!container) {
              return
          }

          if (typeof content !== 'object' && !content.nodeType) {
              container[this._config.html ? 'innerHTML' : 'innerText'] = content;
              return
          }

          if (this._config.html && content.parentElement !== container) {
              container.innerHTML = '';
              container.appendChild(content);
              return
          }

          container.innerText = content.innerText;
      };

      TPManager.prototype.getTitle = function getTitle () {
          var title = this._config.title || '';

          // Fallback to attributes or empty string
          if (!title) {
              title = getAttr(this._targetElement, 'title')
                          || getAttr(this._targetElement, 'data-original-title')
                          || '';
          }

          switch (typeof title) {
              case 'function':
                  title = title(this._targetElement);
                  break
              case 'object':
                  if (title.nodeType && !title.innerHTML.trim()) {
                      title = '';
                  }
                  break
              case 'string':
                  title = title.trim();
                  break
          }

          return title
      };

      TPManager.prototype.handleEvent = function handleEvent (e) {
          if (isDisabled(this._targetElement) || !this._isEnabled) {
              return
          }

          switch (e.type) {
              case 'click':
                  this._handleToggle(e);
                  break
              case 'focusout':
                  this._handleFocusOut(e);
                  break
              case 'mouseleave':
                  this._handleLeave(e);
                  break
              case 'focusin':
              case 'mouseenter':
                  this._handleEnter(e);
                  break
          }
      };

      /*--------------------------------------------------------------------------
      /* PRIVATE
      /*--------------------------------------------------------------------------*/

      TPManager.prototype._addEventListeners = function _addEventListeners () {
            var this$1 = this;

          var triggers = this._config.trigger.trim().split(/\s+/);
          var el = this._targetElement;


          triggers.forEach(function (trigger) {
              switch (trigger) {
                  case 'click':
                      el.addEventListener('click', this$1);
                      break
                  case 'focus':
                      el.addEventListener('focusin', this$1);
                      el.addEventListener('focusout', this$1);
                      break
                  case 'blur':
                      el.addEventListener('focusout', this$1);
                      break
                  case 'hover':
                      el.addEventListener('mouseenter', this$1);
                      el.addEventListener('mouseleave', this$1);
              }
          }, this);
      };

      TPManager.prototype._removeEventListeners = function _removeEventListeners () {
            var this$1 = this;

          ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave']
              .forEach(function (e) { return this$1._targetElement.removeEventListener(e, this$1); }, this);
      };

      TPManager.prototype._handleFocusOut = function _handleFocusOut (e) {
          // Don't trigger if the focus moves from trigger to TP element
          if (
              this._TPElement
              && this._targetElement
              && this._targetElement.contains(e.target)
              && this._TPElement.contains(e.relatedTarget)
          ) {
              return
          }

          // Don't trigger if the focus moves from TP element to trigger
          if (
              this._TPElement
              && this._targetElement
              && this._TPElement.contains(e.target)
              && this._targetElement.contains(e.relatedTarget)
          ) {
              return
          }

          // Don't trigger if the focus moves within the element
          if (
              this._TPElement
              && this._TPElement.contains(e.target)
              && this._TPElement.contains(e.relatedTarget)
          ) {
              return
          }

          this._handleLeave(e);
      };

      TPManager.prototype._getElement = function _getElement () {
          var tpl = this._config.template;
          tpl = (!tpl || typeof tpl !== 'string') ? this.constructor.Defaults.template : this._config.template;

          if (!this._TPElement) {
              var div = document.createElement('div');
              div.innerHTML = tpl.trim();
              this._TPElement = div.firstElementChild ? div.removeChild(div.firstElementChild) : null;
              div = null;
          }

          this._TPElement.tabIndex = -1;

          return this._TPElement
      };

      TPManager.prototype._forceHide = function _forceHide () {
          if (!this._TPElement || !hasClass(this._TPElement, TP_STATE_CLASSES.SHOW)) {
              return
          }

          this._handleEdgeCases(false);
          clearTimeout(this._hoverTimeout);
          this._hoverTimeout = null;
          this._hoverState = '';
          this.hide(null, true);
      };

      TPManager.prototype._handleToggle = function _handleToggle (event) {
          if (!this._isEnabled) {
              return
          }

          if (event) {
              this._activeTrigger.click = !this._activeTrigger.click;
              this._hasActiveTrigger() ? this._handleEnter(null) : this._handleLeave(null);
              return
          }

          hasClass(this._getElement(), TP_STATE_CLASSES.SHOW) ? this._handleLeave(null) : this._handleEnter(null);
      };

      TPManager.prototype._handleLeave = function _handleLeave (e) {
            var this$1 = this;

          if (e) {
              var trigger = e.type === 'focusout' ? 'focus' : 'hover';
              this._activeTrigger[trigger] = false;

              if (e.type === 'focusout' && /blur/.test(this._config.trigger)) {
                  this._activeTrigger.click = false;
                  this._activeTrigger.hover = false;
              }
          }

          if (this._hasActiveTrigger()) {
              return
          }

          clearTimeout(this._hoverTimeout);

          this._hoverState = TOOLTIP_HOVER_STATE_CLASSES.OUT;

          if (!this._config.delay || !this._config.delay.hide) {
              this.hide();
              return
          }

          this._hoverTimeout = setTimeout(function () {
              if (this$1._hoverState === TOOLTIP_HOVER_STATE_CLASSES.OUT) {
                  this$1.hide();
              }
          }, this._config.delay.hide);
      };


      TPManager.prototype._hasActiveTrigger = function _hasActiveTrigger () {
            var this$1 = this;

          for (var trigger in this$1._activeTrigger) {
              if (this$1._activeTrigger[trigger]) {
                  return true
              }
          }

          return false
      };

      TPManager.prototype._updateTitleAttributes = function _updateTitleAttributes () {
          var el = this._targetElement;
          var titleType = typeof getAttr(el, 'data-original-title');
          if (getAttr(el, 'title') || titleType !== 'string') {
              setAttr(el, 'data-original-title', getAttr(el, 'title') || '');
              setAttr(el, 'title', '');
          }
      };

      TPManager.prototype._handleEnter = function _handleEnter (e) {
            var this$1 = this;

          if (e) {
              var trigger = e.type === 'focusin' ? focus : 'hover';
              this._activeTrigger[trigger] = true;
          }

          if (hasClass(this._getElement(), TP_STATE_CLASSES.SHOW) || this._hoverState === TP_STATE_CLASSES.SHOW) {
              this._hoverState = TP_STATE_CLASSES.SHOW;
              return
          }

          clearTimeout(this._hoverTimeout);
          this._hoverState = TP_STATE_CLASSES.SHOW;

          if (!this._config.delay || !this._config.delay.show) {
              this.show();
              return
          }

          this._hoverTimeout = setTimeout(function () {
              if (this$1._hoverState === TP_STATE_CLASSES.SHOW) {
                  this$1.show();
              }
          }, this._config.delay.show);
      };

      TPManager.prototype._handleEdgeCases = function _handleEdgeCases (on) {
          if (this._TPElement === null) {
              return
          }

          this._setModalListener(on);
          this._visibleCheck(on);
          this._setRouteWatcher(on);
          this._setOnTouchStartListener(on);

          if (on && /(focus|blur)/.test(this._config.trigger)) {
              this._TPElement.addEventListener('focusout', this);
          } else {
              this._TPElement.removeEventListener('focusout', this);
          }
      };

      TPManager.prototype._setModalListener = function _setModalListener (on) {
          var modal = closest(MODAL_CLASS, this._targetElement);

          if (!modal) {
              return
          }

          if (this._$root) {
              this._$root[on ? '$on' : '$off'](MODAL_EVENTS.HIDDEN, this._forceHide.bind(this));
          }
      };

      TPManager.prototype._visibleCheck = function _visibleCheck (on) {
            var this$1 = this;

          clearInterval(this._visibleInterval);
          this._visibleInterval = null;

          if (!on) {
              return
          }

          this._visibleInterval = setInterval(function () {
              var tip = this$1._getElement();
              if (tip && !isVisible(this$1._targetElement) && hasClass(tip, TP_STATE_CLASSES.SHOW)) {
                  this$1._forceHide();
              }
          }, 100);
      };

      TPManager.prototype._setRouteWatcher = function _setRouteWatcher (on) {
            var this$1 = this;

          if (on) {
              this._setRouteWatcher(false);
              if (this._$root && Boolean(this._$root.route)) {
                  this._routeWatcher = this._$root.$watch('$route', function (newVal, oldVal) {
                      if (newVal === oldVal) {
                          return
                      }

                      this$1._forceHide();
                  });
              }
          } else {
              if (this._routeWatcher) {
                  this._routeWatcher();
                  this._routeWatcher = null;
              }
          }
      };

      TPManager.prototype._setOnTouchStartListener = function _setOnTouchStartListener (on) {
          if (!('ontouchstart' in document.documentElement)) {
              return
          }

          Array.from(document.body.children).forEach(function (el) {
              if (on) {
                  el.addEventListener('mouseover', function () {});
              } else {
                  el.removeEventListener('mouseover', function () {});
              }
          });
      };

      TPManager.prototype._getPopperConfig = function _getPopperConfig (placement, tip) {
            var this$1 = this;

          return {
              placement: this.constructor.getPlacement(placement),
              modifiers: {
                  offset: { offset: this._getOffset(placement, tip) },
                  flip: { behavior: this._config.fallbackPlacement },
                  arrow: { element: '.arrow' },
                  preventOverflow: { boundariesElement: this._config.boundary }
              },
              onCreate: function (data) {
                  if (data.originalPlacement !== data.placement) {
                      this$1._handlePopperPlacementChange(data);
                  }
              },
              onUpdate: function (data) {
                  this$1._handlePopperPlacementChange(data);
              }
          }
      };

      TPManager.prototype._getOffset = function _getOffset (placement, tip) {
          if (this._config.offset) {
              return this._config.offset
          }

          var arrow = selectElement(TOOLTIP_SELECTORS.ARROW, tip);
          var arrowOffset = parseFloat(getComputedStyles(arrow).width) + parseFloat(this._config.arrowPadding);
          switch (TP_OFFSET_MAP[placement.toUpperCase()]) {
              case +1:
                  return ("+50%p - " + arrowOffset + "px")
              case -1:
                  return ("-50%p + " + arrowOffset + "px")
              default:
                  return 0
          }
      };

      TPManager.prototype._handlePopperPlacementChange = function _handlePopperPlacementChange (data) {
          var TPElement = this._getElement();
          var tabClass = TPElement.className.match(new RegExp(("\\b" + (this.constructor.ClassPrefix) + "\\S+"), 'g'));

          if (tabClass === null && !tabClass.length) {
              return
          }

          tabClass.forEach(function (className) { return removeClass(TPElement, className); });
          this._addPlacementClass(this.constructor.getPlacement(data.placement));
      };

      TPManager.prototype._removePopper = function _removePopper () {
          if (this._popperInstance) {
              this._popperInstance.destroy();
          }

          this._popperInstance = null;
      };

      TPManager.prototype._getContainer = function _getContainer () {
          var container = this._config.container;
          var body = document.body;
          return container === false ? (closest(MODAL_CLASS, this._targetElement) || body) : (selectElement(container, body) || body)
      };

      TPManager.prototype._emitCustomEvent = function _emitCustomEvent (event) {
          var eventName = event.type;

          if (this._$root && this._$root.$emit) {
              this._$root.$emit(("dr:" + (this.constructor.Name) + ":" + eventName), event);
          }

          var callbacks = this._config.callbacks || {};

          if (typeof callbacks[eventName] === 'function') {
              callbacks[eventName]();
          }
      };

      TPManager.prototype._transitionOnce = function _transitionOnce (TPElement, completeHandlerFn) {
            var this$1 = this;

          var transEvents = this._getTransitionEndEvents();
          var called = false;
          clearTimeout(this._fadeTimeout);
          this._fadeTimeout = null;

          var fnOnce = function () {
              if (called) {
                  return
              }

              called = true;
              clearTimeout(this$1._fadeTimeout);
              this$1._fadeTimeout = null;
              transEvents.forEach(function (eventName) { return TPElement.removeEventListener(eventName, fnOnce); });
              completeHandlerFn();
          };

          if (hasClass(TPElement, TP_STATE_CLASSES.FADE)) {
              transEvents.forEach(function (eventName) { return TPElement.addEventListener(eventName, fnOnce); });
              this._fadeTimeout = setTimeout(fnOnce, 150);
          } else {
              fnOnce();
          }
      };

      TPManager.prototype._getTransitionEndEvents = function _getTransitionEndEvents () {
            var this$1 = this;

          for (var name in TransitionEndEvents) {
              if (this$1._targetElement.style[name] !== undefined) {
                  return TransitionEndEvents[name]
              }
          }

          return []
      };

      TPManager.prototype._addPlacementClass = function _addPlacementClass (placement) {
          var Popover = this._getElement();
          addClass(Popover, ((this.constructor.ClassPrefix) + "-" + placement));
      };

    Object.defineProperties( TPManager, staticAccessors );

    var PopoverDefaults = {
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    };

    var Defaults$2 = Object.assign({}, TPManager.Defaults, PopoverDefaults);

    var Popover = (function (TPManager$$1) {
        function Popover () {
            TPManager$$1.apply(this, arguments);
        }

        if ( TPManager$$1 ) Popover.__proto__ = TPManager$$1;
        Popover.prototype = Object.create( TPManager$$1 && TPManager$$1.prototype );
        Popover.prototype.constructor = Popover;

        var staticAccessors = { Name: { configurable: true },Defaults: { configurable: true },ClassPrefix: { configurable: true } };

        staticAccessors.Name.get = function () {
            return 'popover'
        };

        staticAccessors.Defaults.get = function () {
            return Defaults$2
        };

        staticAccessors.ClassPrefix.get = function () {
            return 'bs-popover'
        };

        /*--------------------------------------------------------------------------
        /* OVERRIDES
        /*--------------------------------------------------------------------------*/

        /**
         * Checks if the Popover has content.
         * @returns True if the Popover has content (title or body), false otherwise.
         */
        Popover.prototype.hasContent = function hasContent (TPElement) {
            var Popover = TPElement || this._TPElement;

            if (!Popover) {
                return false
            }

            var popoverHeaderEl = selectElement(POPOVER_SELECTORS.HEADER, Popover);
            var popoverBodyEl = selectElement(POPOVER_SELECTORS.BODY, Popover);
            var hasHeader = Boolean((popoverHeaderEl || {}).innerHTML);
            var hasBody = Boolean((popoverBodyEl || {}).innerHTML);

            return hasHeader || hasBody
        };

        /**
         * Sets the content for the Popover element.
         */
        Popover.prototype.setContent = function setContent (TPElement) {
            var Popover = TPElement || this._TPElement;

            var popoverHeaderEl = selectElement(POPOVER_SELECTORS.HEADER, Popover);
            var popoverBodyEl = selectElement(POPOVER_SELECTORS.BODY, Popover);

            this.setElementContent( popoverHeaderEl, this.getTitle());
            this.setElementContent( popoverBodyEl, this.getContent());

            removeClasses(Popover, [TP_STATE_CLASSES.FADE, TP_STATE_CLASSES.SHOW]);
        };

        /*--------------------------------------------------------------------------
        /* CLASS SPECIFIC
        /*--------------------------------------------------------------------------*/

        /**
         * Returns the Popover content.
         */
        Popover.prototype.getContent = function getContent () {
            var content = this._config.content || '';

            switch (content) {
                case 'string':
                    content = content.trim();
                    break
                case 'function':
                    content = content(this._targetElement);
                    break
                case 'object':
                    if (content.nodeType && !content.innerHTML.trim()) {
                        content = '';
                    }
                    break
            }

            return content
        };

        Object.defineProperties( Popover, staticAccessors );

        return Popover;
    }(TPManager));

    /**
     * Observes DOM changes.
     * @see http://stackoverflow.com/questions/3219758
     */
    function DOMObserver (el, callback, opts) {
        if ( opts === void 0 ) opts = null;


        if (opts === null) {
            opts = {
                subtree: true,
                childList: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            };
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var eventListenerSupported = window.addEventListener;

        el = el ? (el.$el || el) : null;
        if (!isElement(el)) {
            return null
        }

        var obs = null;

        if (MutationObserver) {
            obs = new MutationObserver(function (mutations) {
                var changed = false;
                for (var i = 0; i < mutations.length && !changed; i++) {
                    var mutation = mutations[i];
                    var type = mutation.type;
                    var target = mutation.target;
                    if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
                        changed = true;
                    } else if (type === 'attributes') {
                        changed = true;
                    } else if (type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                        changed = true;
                    }
                }
                if (changed) {
                    callback();
                }
            });

            obs.observe(el, Object.assign({}, { childList: true, subtree: true }, opts));
        } else if (eventListenerSupported) {
            el.addEventListener('DOMNodeInserted', callback, false);
            el.addEventListener('DOMNodeRemoved', callback, false);
        }

        return obs
    }

    var TooltipPopoverMixin = {
        /**
         * Watch the show and disabled props and handle each case accordingly.
         */
        watch: {
            show: function show (show$1, oldShow) {
                if (show$1 === oldShow) {
                    return
                }

                show$1 ? this._handleShow() : this._handleHide();
            },
            disabled: function disabled (disabled$1, oldDisabled) {
                if (disabled$1 === oldDisabled) {
                    return
                }

                disabled$1 ? this._handleDisable() : this._handleEnable();
            }
        },

        /**
         * Setup initial values after the instance is created.
         */
        created: function created() {
            this._TPInstance = null;
            this._obs_title = null;
            this._obs_content = null;
        },

        /**
         * Bootstrap the Tooltip/Popover after the instance is mounted.
         */
        mounted: function mounted() {
            var this$1 = this;

            this.$nextTick(function () {
                // The Tooltip/Popover instance is defined in each individual component
                var TPInstance = this$1.bootstrap();

                // If there's no TPInstance it means that there's no target, so just return here
                if (!TPInstance) {
                    return
                }

                this$1._enableDOMObserver();

                if (this$1.disabled) {
                    this$1._handleDisable();
                }

                if (this$1.show) {
                    this$1._handleShow();
                }
            });
        },

        /**
         * Update the config when data changes.
         */
        updated: function updated() {
            if (!this._TPInstance) {
                return
            }

            this._TPInstance.updateConfig(this.getUpdatedConfig());
        },

        /**
         * Setup the observers.
         */
        activated: function activated() {
            this._enableDOMObserver();
        },

        /**
         * Disable the observers and hide the instance.
         */
        deactivated: function deactivated() {
            if (this._TPInstance) {
                this._disableDOMObserver();
                this._TPInstance.hide();
            }
        },

        /**
         * Clean up everything before the instance is destroyed.
         */
        beforeDestroy: function beforeDestroy() {
            this._disableDOMObserver();

            if (this._TPInstance) {
                this._TPInstance.destroy();
                this._TPInstance = null;
            }
        },

        computed: {
            baseConfig: function baseConfig() {
                var title = (this.title || '').trim();
                var content = (this.content || '').trim();
                var placement = TP_PLACEMENTS[this.placement.toUpperCase()] || 'auto';
                var container = this.container || false;
                var boundary = this.boundary;
                var delay = (typeof this.delay === 'object') ? this.delay : (parseInt(this.delay, 10) || 0);
                var offset = this.offset || 0;
                var animation = !this.noFade;
                var trigger = isArray(this.triggers) ? this.triggers.join(' ') : this.triggers;

                var callbacks = {
                    show: this._emitShowEvent,
                    shown: this._emitShownEvent,
                    hide: this._emitHideEvent,
                    hidden: this._emitHiddenEvent,
                    enabled: this._emitEnabledEvent,
                    disabled: this._emitDisabledEvent
                };

                return {
                    title: title,
                    content: content,
                    placement: placement,
                    container: container,
                    boundary: boundary,
                    delay: delay,
                    offset: offset,
                    animation: animation,
                    trigger: trigger,
                    callbacks: callbacks
                }
            }
        },

        methods: {

            /*--------------------------------------------------------------------------
            /* PUBLIC
            /*--------------------------------------------------------------------------*/

            /**
             * Returns the target element.
             */
            getTarget: function getTarget() {
                var _target = null;

                switch (typeof this.target) {
                    case 'function':
                        _target = this.target();
                        break
                    case 'string':
                        _target = getById(this.target);
                        break
                    case 'object':
                        if (isElement(this.target.$el)) {
                            _target = this.target.$el;
                        } else if (isElement(this.target)) {
                            _target = this.target;
                        }
                        break
                }

                return _target
            },

            /**
             * Returns the updated config.
             */
            getUpdatedConfig: function getUpdatedConfig() {
                var updatedConfig = Object.assign({}, this.baseConfig);

                // override title if slot is used
                if (this.$refs.title) {
                    updatedConfig.title = this.$refs.title;
                    updatedConfig.html = true;
                }

                // override content if slot is used
                if (this.$refs.content) {
                    updatedConfig.content = this.$refs.content;
                    updatedConfig.html = true;
                }

                return updatedConfig
            },

            /*--------------------------------------------------------------------------
            /* PRIVATE
            /*--------------------------------------------------------------------------*/

            _handleShow: function _handleShow() {
                if (this._TPInstance) {
                    this._TPInstance.show();
                }
            },

            _handleHide: function _handleHide(callback) {
                if (this._TPInstance) {
                    this._TPInstance.hide(callback);
                } else if (typeof callback === 'function') {
                    callback();
                }
            },

            _handleDisable: function _handleDisable() {
                if (this._TPInstance) {
                    this._TPInstance.disable();
                }
            },

            _handleEnable: function _handleEnable() {
                if (this._TPInstance) {
                    this._TPInstance.enable();
                }
            },

            _emitShowEvent: function _emitShowEvent(event) {
                this.$emit('show', event);
            },

            _emitShownEvent: function _emitShownEvent(event) {
                this._enableDOMObserver();

                this.$emit('update:show', true);
                this.$emit('shown', event);
            },

            _emitHideEvent: function _emitHideEvent(event) {
                this.$emit('hide', event);
            },

            _emitHiddenEvent: function _emitHiddenEvent(event) {
                this._disableDOMObserver();

                this.$emit('update:show', false);
                this.$emit('hidden', event);
            },

            _emitEnabledEvent: function _emitEnabledEvent(event) {
                if (!event || event.type !== 'enabled') {
                    return
                }

                this.$emit('update:disabled', false);
                this.$emit('disabled');
            },

            _emitDisabledEvent: function _emitDisabledEvent(event) {
                if (!event || event.type !== 'disabled') {
                    return
                }

                this.$emit('update:disabled', true);
                this.$emit('enabled');
            },

            _updatePosition: function _updatePosition() {
                if (this._TPInstance) {
                    this._TPInstance.update();
                }
            },

            _enableDOMObserver: function _enableDOMObserver() {
                if (this.$refs.title) {
                    this._obs_title = DOMObserver(
                        this.$refs.title,
                        this._updatePosition.bind(this)
                    );
                }

                if (this.$refs.content) {
                    this._obs_content = DOMObserver(
                        this.$refs.content,
                        this._updatePosition.bind(this)
                    );
                }
            },

            _disableDOMObserver: function _disableDOMObserver() {
                if (this._obs_title) {
                    this._obs_title.disconnect();
                    this._obs_title = null;
                }

                if (this._obs_content) {
                    this._obs_content.disconnect();
                    this._obs_content = null;
                }
            }
        }
    };

    //

    var script$S = {
        name: 'd-popover',
        mixins: [ TooltipPopoverMixin ],
        props: {
            /**
             * Title
             */
            title: {
                type: String,
                default: ''
            },
            /**
             * Content
             */
            content: {
                type: String,
                default: ''
            },
            /**
             * Triggers
             */
            triggers: {
                type: [String, Array],
                default: 'click'
            },
            /**
             * Placement.
             */
            placement: {
                type: String,
                default: 'top',
                validator: function (val) { return Object.keys(TP_PLACEMENTS).map(function (p) { return p.toLowerCase(); }).includes(val); }
            },
            /**
             * The target element.
             */
            target: {
                type: [String, Object, Function]
            },
            /**
             * Delay in miliseconds.
             */
            delay: {
                type: [Number, Object, String],
                default: 0
            },
            /**
             * Offset.
             */
            offset: {
                type: [Number, String]
            },
            /**
             * Disable animations.
             */
            noFade: {
                type: Boolean,
                default: false
            },
            /**
             * Wrapping container.
             */
            container: {
                type: String,
                default: null
            },
            /**
             * Instance boundaries.
             */
            boundary: {
                type: [String, Object],
                default: 'scrollParent'
            },
            /**
             * Show state.
             */
            show: {
                type: Boolean,
                default: false
            },
            /**
             * Disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            /**
             * Gets the target and if the target exists, it initializes the Popover.
             * Used inside the TooltipPopoverMixin
             */
            bootstrap: function bootstrap() {
                var target = this.getTarget();

                if (target) {
                    this._TPInstance = new Popover(
                        target,
                        this.getUpdatedConfig(),
                        this.$root
                    );
                }

                return this._TPInstance
            }
        }
    };

    /* script */
                var __vue_script__$S = script$S;
                
    /* template */
    var __vue_render__$S = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "d-none",
          staticStyle: { display: "none" },
          attrs: { "aria-hidden": "true" }
        },
        [
          _c("div", { ref: "title" }, [_vm._t("title")], 2),
          _vm._v(" "),
          _c("div", { ref: "content" }, [_vm._t("default")], 2)
        ]
      )
    };
    var __vue_staticRenderFns__$S = [];
    __vue_render__$S._withStripped = true;

      /* style */
      var __vue_inject_styles__$S = undefined;
      /* scoped */
      var __vue_scope_id__$S = undefined;
      /* module identifier */
      var __vue_module_identifier__$S = undefined;
      /* functional template */
      var __vue_is_functional_template__$S = false;
      /* component normalizer */
      function __vue_normalize__$S(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/popover/Popover.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$S() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$S.styles || (__vue_create_injector__$S.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dPopover = __vue_normalize__$S(
        { render: __vue_render__$S, staticRenderFns: __vue_staticRenderFns__$S },
        __vue_inject_styles__$S,
        __vue_script__$S,
        __vue_scope_id__$S,
        __vue_is_functional_template__$S,
        __vue_module_identifier__$S,
        __vue_create_injector__$S,
        undefined
      );

    var components$p = {
        dPopover: dPopover
    };

    var VuePlugin$p = {
      install: function install (Vue) {
        registerComponents(Vue, components$p);
      }
    };

    vueUse(VuePlugin$p);

    //
    //
    //
    //
    //
    //
    //
    //

    var script$T = {
        name: 'd-progress',
        props: {
            /**
             * Theme color.
             */
            theme: {
                type: String,
                default: 'primary'
            },
            /**
             * Whether it should be striped, or not.
             */
            striped: {
                type: Boolean,
                default: false
            },
            /**
             * Whether it should be animated, or not.
             */
            animated: {
                type: Boolean,
                default: false
            },
            /**
             * Height value.
             */
            height: {
                type: String,
                default: null
            },
            /**
             * Precision number of digits.
             */
            precision: {
                type: Number,
                default: 0
            },
            /**
             * Whether to show progress, or not.
             */
            showProgress: {
                type: Boolean,
                default: false
            },
            /**
             * Whether to show the value, or not.
             */
            showValue: {
                type: Boolean,
                default: false
            },
            /**
             * The maximum value.
             */
            max: {
                type: Number,
                default: 100
            },
            /**
             * The value.
             */
            value: {
                type: Number,
                default: 0
            },
            /**
             * The size.
             */
            size: {
                type: String,
                default: null,
                validator: function (v) { return ['sm', 'lg'].includes(v); }
            }
        }
    };

    /* script */
                var __vue_script__$T = script$T;
                
    /* template */
    var __vue_render__$T = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: ["progress", _vm.size ? "progress-" + _vm.size : ""],
          style: { height: _vm.height || null }
        },
        [
          _vm._t("default", [
            _c("d-progress-bar", _vm._b({}, "d-progress-bar", _vm.$props, false))
          ])
        ],
        2
      )
    };
    var __vue_staticRenderFns__$T = [];
    __vue_render__$T._withStripped = true;

      /* style */
      var __vue_inject_styles__$T = function (inject) {
        if (!inject) { return }
        inject("data-v-719823bb_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Hide labels for small progress bars */\n.progress-sm span {\n    color: transparent;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/progress/Progress.vue"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAwFA,yCAAA;AACA;IACA,mBAAA;CACA","file":"Progress.vue","sourcesContent":["<template>\n    <div :class=\"['progress', size ? `progress-${size}` : '']\" :style=\"{ height: height || null }\">\n        <slot>\n            <d-progress-bar v-bind=\"$props\"/>\n        </slot>\n    </div>\n</template>\n\n<script>\nexport default {\n    name: 'd-progress',\n    props: {\n        /**\n         * Theme color.\n         */\n        theme: {\n            type: String,\n            default: 'primary'\n        },\n        /**\n         * Whether it should be striped, or not.\n         */\n        striped: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether it should be animated, or not.\n         */\n        animated: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Height value.\n         */\n        height: {\n            type: String,\n            default: null\n        },\n        /**\n         * Precision number of digits.\n         */\n        precision: {\n            type: Number,\n            default: 0\n        },\n        /**\n         * Whether to show progress, or not.\n         */\n        showProgress: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether to show the value, or not.\n         */\n        showValue: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The maximum value.\n         */\n        max: {\n            type: Number,\n            default: 100\n        },\n        /**\n         * The value.\n         */\n        value: {\n            type: Number,\n            default: 0\n        },\n        /**\n         * The size.\n         */\n        size: {\n            type: String,\n            default: null,\n            validator: (v) => ['sm', 'lg'].includes(v)\n        }\n    }\n}\n</script>\n\n<style>\n    /* Hide labels for small progress bars */\n    .progress-sm span {\n        color: transparent;\n    }\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$T = undefined;
      /* module identifier */
      var __vue_module_identifier__$T = undefined;
      /* functional template */
      var __vue_is_functional_template__$T = false;
      /* component normalizer */
      function __vue_normalize__$T(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/progress/Progress.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$T() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$T.styles || (__vue_create_injector__$T.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dProgress = __vue_normalize__$T(
        { render: __vue_render__$T, staticRenderFns: __vue_staticRenderFns__$T },
        __vue_inject_styles__$T,
        __vue_script__$T,
        __vue_scope_id__$T,
        __vue_is_functional_template__$T,
        __vue_module_identifier__$T,
        __vue_create_injector__$T,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$U = {
        name: 'd-progress-bar',
        props: {
            /**
             * The value.
             */
            value: {
                type: Number,
                default: 0
            },
            /**
             * The label.
             */
            label: {
                type: String,
                value: null
            },
            /**
             * The max value.
             */
            max: {
                type: Number,
                default: null
            },
            /**
             * Precision number of digits.
             */
            precision: {
                type: Number,
                default: null
            },
            /**
             * Theme color.
             */
            theme: {
                type: String,
                default: null
            },
            /**
             * Whether it should be striped, or not.
             */
            striped: {
                type: Boolean,
                default: null
            },
            /**
             * Whether it should be animated, or not.
             */
            animated: {
                type: Boolean,
                default: null
            },
            /**
             * Whether it should show the progress, or not.
             */
            showProgress: {
                type: Boolean,
                default: null
            },
            /**
             * Whether it should show the value, or not.
             */
            showValue: {
                type: Boolean,
                default: null
            }
        },
        computed: {
            computedTheme: function computedTheme() {
                return this.theme || this.$parent.theme
            },
            computedStriped: function computedStriped() {
                return typeof this.striped === 'boolean' ? this.striped : (this.$parent.striped || false)
            },
            computedAnimated: function computedAnimated() {
                return typeof this.animated === 'boolean' ? this.animated : (this.$parent.animated || false)
            },
            computedMax: function computedMax() {
                return typeof this.max === 'number' ? this.max : (this.$parent.max || 100)
            },
            computedPrecision: function computedPrecision() {
                return typeof this.precision === 'number' ? this.precision : (this.$parent.precision || 0)
            },
            computedShowProgress: function computedShowProgress() {
                return typeof this.showProgress === 'boolean' ? this.showProgress : (this.$parent.showProgress || false)
            },
            computedShowValue: function computedShowValue() {
                return typeof this.showValue === 'boolean' ? this.showValue : (this.$parent.showValue || false)
            },
            computedProgress: function computedProgress() {
                var p = Math.pow(10, this.computedPrecision);
                return Math.round((100 * p * this.value) / this.computedMax) / p
            }
        }
    };

    /* script */
                var __vue_script__$U = script$U;
                
    /* template */
    var __vue_render__$U = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "progress-bar",
            _vm.computedTheme ? "bg-" + _vm.computedTheme : "",
            _vm.computedStriped || _vm.computedAnimated
              ? "progress-bar-striped"
              : "",
            _vm.computedAnimated ? "progress-bar-animated" : ""
          ],
          style: { width: 100 * (_vm.value / _vm.computedMax) + "%" },
          attrs: {
            role: "progressbar",
            "aria-valuemin": 0,
            "aria-valuemax": _vm.computedMax.toString(),
            "aria-valuenow": _vm.value.toFixed(_vm.computedPrecision)
          }
        },
        [
          _vm._t("default", [
            _vm.label
              ? _c("span", { domProps: { innerHTML: _vm._s(_vm.label) } })
              : _vm._e(),
            _vm._v(" "),
            _vm.computedShowProgress
              ? _c("span", [
                  _vm._v(
                    _vm._s(_vm.computedProgress.toFixed(_vm.computedPrecision))
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.computedShowValue
              ? _c("span", [
                  _vm._v(_vm._s(_vm.value.toFixed(_vm.computedPrecision)))
                ])
              : _vm._e()
          ])
        ],
        2
      )
    };
    var __vue_staticRenderFns__$U = [];
    __vue_render__$U._withStripped = true;

      /* style */
      var __vue_inject_styles__$U = function (inject) {
        if (!inject) { return }
        inject("data-v-c26047f0_0", { source: "\n.progress-bar[data-v-c26047f0] {\n    height: 100%;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/progress/ProgressBar.vue"],"names":[],"mappings":";AAuHA;IACA,aAAA;CACA","file":"ProgressBar.vue","sourcesContent":["<template>\n    <div :class=\"[\n        'progress-bar',\n        computedTheme ? `bg-${computedTheme}` : '',\n        (computedStriped || computedAnimated) ? 'progress-bar-striped' : '',\n        computedAnimated ? 'progress-bar-animated' : ''\n    ]\"\n    :style=\"{ width: (100 * (value / computedMax)) + '%' }\"\n    role=\"progressbar\"\n    :aria-valuemin=\"0\"\n    :aria-valuemax=\"computedMax.toString()\"\n    :aria-valuenow=\"value.toFixed(computedPrecision)\">\n        <slot>\n            <span v-if=\"label\" v-html=\"label\"></span>\n            <span v-if=\"computedShowProgress\">{{ computedProgress.toFixed(computedPrecision) }}</span>\n            <span v-if=\"computedShowValue\">{{ value.toFixed(computedPrecision) }}</span>\n        </slot>\n    </div>\n</template>\n\n<script>\nexport default {\n    name: 'd-progress-bar',\n    props: {\n        /**\n         * The value.\n         */\n        value: {\n            type: Number,\n            default: 0\n        },\n        /**\n         * The label.\n         */\n        label: {\n            type: String,\n            value: null\n        },\n        /**\n         * The max value.\n         */\n        max: {\n            type: Number,\n            default: null\n        },\n        /**\n         * Precision number of digits.\n         */\n        precision: {\n            type: Number,\n            default: null\n        },\n        /**\n         * Theme color.\n         */\n        theme: {\n            type: String,\n            default: null\n        },\n        /**\n         * Whether it should be striped, or not.\n         */\n        striped: {\n            type: Boolean,\n            default: null\n        },\n        /**\n         * Whether it should be animated, or not.\n         */\n        animated: {\n            type: Boolean,\n            default: null\n        },\n        /**\n         * Whether it should show the progress, or not.\n         */\n        showProgress: {\n            type: Boolean,\n            default: null\n        },\n        /**\n         * Whether it should show the value, or not.\n         */\n        showValue: {\n            type: Boolean,\n            default: null\n        }\n    },\n    computed: {\n        computedTheme() {\n            return this.theme || this.$parent.theme\n        },\n        computedStriped() {\n            return typeof this.striped === 'boolean' ? this.striped : (this.$parent.striped || false)\n        },\n        computedAnimated() {\n            return typeof this.animated === 'boolean' ? this.animated : (this.$parent.animated || false)\n        },\n        computedMax() {\n            return typeof this.max === 'number' ? this.max : (this.$parent.max || 100)\n        },\n        computedPrecision() {\n            return typeof this.precision === 'number' ? this.precision : (this.$parent.precision || 0)\n        },\n        computedShowProgress() {\n            return typeof this.showProgress === 'boolean' ? this.showProgress : (this.$parent.showProgress || false)\n        },\n        computedShowValue() {\n            return typeof this.showValue === 'boolean' ? this.showValue : (this.$parent.showValue || false)\n        },\n        computedProgress() {\n            const p = Math.pow(10, this.computedPrecision)\n            return Math.round((100 * p * this.value) / this.computedMax) / p\n        }\n    }\n}\n</script>\n\n<style scoped>\n.progress-bar {\n    height: 100%;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$U = "data-v-c26047f0";
      /* module identifier */
      var __vue_module_identifier__$U = undefined;
      /* functional template */
      var __vue_is_functional_template__$U = false;
      /* component normalizer */
      function __vue_normalize__$U(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/progress/ProgressBar.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$U() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$U.styles || (__vue_create_injector__$U.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dProgressBar = __vue_normalize__$U(
        { render: __vue_render__$U, staticRenderFns: __vue_staticRenderFns__$U },
        __vue_inject_styles__$U,
        __vue_script__$U,
        __vue_scope_id__$U,
        __vue_is_functional_template__$U,
        __vue_module_identifier__$U,
        __vue_create_injector__$U,
        undefined
      );

    var components$q = {
        dProgress: dProgress,
        dProgressBar: dProgressBar
    };

    var VuePlugin$q = {
      install: function install (Vue) {
        registerComponents(Vue, components$q);
      }
    };

    vueUse(VuePlugin$q);

    //

    var script$V = {
        name: 'd-slider',
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * Options config.
             */
            options: {
                type: Object,
                default: function default$1() {
                    return {}
                }
            },
            /**
             * Slider value.
             */
            value: {
                type: [String, Array, Number],
                required: true
            },
            /**
             * Start value.
             */
            start: {
                type: [Number, Array],
                default: 0
            },
            /**
             * Range configuration.
             */
            range: {
                type: Object,
                default: function default$2() {
                    return { min: 0, max: 100 }
                }
            },
            /**
             * Connect configuration.
             */
            connect: {
                type: [Boolean, Array],
                default: function default$3() {
                    return [true, false]
                }
            }
        },
        watch: {
            value: function value(newVal, oldVal) {
                var sliderInstance = this.$el.noUiSlider;
                var sliderValue = sliderInstance.get();

                if (newVal !== oldVal && sliderValue !== newVal) {
                    if (Array.isArray(sliderValue) && Array.isArray(newVal)) {
                        if (
                            oldVal.length === newVal.length &&
                            oldVal.every(function (v, i) { return v === newVal[i]; } )
                        ) {
                            sliderInstance.set(newVal);
                        }
                    } else {
                        sliderInstance.set(newVal);
                    }
                }
            }
        },
        computed: {
            computedID: function computedID() {
                return this.id || ("dr-slider-" + (guid()))
            }
        },
        mounted: function mounted() {
            var this$1 = this;

            var config = Object.assign({}, {start: this.value || this.start,
                connect: this.connect,
                range: this.range},
                this.options);

            noUiSlider.create(this.$el, config);

            this.$el.noUiSlider.on('slide', function () {
                var value = this$1.$el.noUiSlider.get();
                if (value !== this$1.value) {
                    this$1.$emit('input', value);
                }
            });
        }
    };

    /* script */
                var __vue_script__$V = script$V;
                
    /* template */
    var __vue_render__$V = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", {
        ref: "slider",
        staticClass: "shards-custom-slider",
        attrs: { id: _vm.computedID }
      })
    };
    var __vue_staticRenderFns__$V = [];
    __vue_render__$V._withStripped = true;

      /* style */
      var __vue_inject_styles__$V = undefined;
      /* scoped */
      var __vue_scope_id__$V = undefined;
      /* module identifier */
      var __vue_module_identifier__$V = undefined;
      /* functional template */
      var __vue_is_functional_template__$V = false;
      /* component normalizer */
      function __vue_normalize__$V(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/slider/Slider.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$V() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$V.styles || (__vue_create_injector__$V.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dSlider = __vue_normalize__$V(
        { render: __vue_render__$V, staticRenderFns: __vue_staticRenderFns__$V },
        __vue_inject_styles__$V,
        __vue_script__$V,
        __vue_scope_id__$V,
        __vue_is_functional_template__$V,
        __vue_module_identifier__$V,
        __vue_create_injector__$V,
        undefined
      );

    var components$r = {
        dSlider: dSlider
    };

    var VuePlugin$r = {
      install: function install (Vue) {
        registerComponents(Vue, components$r);
      }
    };

    vueUse(VuePlugin$r);

    //

    var script$W = {
        name: 'd-tab-button',
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The active state.
             */
            active: {
                type: Boolean,
                default: false
            },
            /**
             * The disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * The link class.
             */
            linkClass: {
                type: String,
                default: null
            },
            /**
             * The item class.
             */
            itemClass: {
                type: String,
                default: null
            },
            /**
             * The aria-setsize value.
             */
            setSize: {
                type: Number,
                default: 0,
            },
            /**
             * The position in set value (aria-posinset).
             */
            posInSet: {
                type: Number,
                default: 0,
            },
            /**
             * The aria-controls value.
             */
            controls: {
                type: String,
                default: null
            },
            /**
             * The content.
             */
            content: {
                type: String,
                default: null
            }
        },
        methods: {
            handleClick: function handleClick(e) {
                if (this.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (e.type === 'click'
                    || e.keyCode === KEYCODES.ENTER
                    || e.keyCode === KEYCODES.SPACE) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.$emit('click', e);
                }
            }
        },
        computed: {
            computedID: function computedID() {
                return this.id || ("d-tab-btn-" + (guid()))
            }
        }
    };

    /* script */
                var __vue_script__$W = script$W;
                
    /* template */
    var __vue_render__$W = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "li",
        { class: ["nav-item", _vm.itemClass], attrs: { role: "presentation" } },
        [
          _c("a", {
            class: [
              "nav-link",
              _vm.active ? "active" : "",
              _vm.disabled ? "disabled" : "",
              _vm.linkClass
            ],
            attrs: {
              role: "tab",
              tabindex: "-1",
              id: _vm.computedID,
              disabled: _vm.disabled,
              "aria-selected": _vm.active ? "true" : "false",
              "aria-setsize": _vm.setSize,
              "aria-posinset": _vm.posInSet,
              "aria-controls": _vm.controls
            },
            domProps: { innerHTML: _vm._s(_vm.content) },
            on: { click: _vm.handleClick, keydown: _vm.handleClick }
          })
        ]
      )
    };
    var __vue_staticRenderFns__$W = [];
    __vue_render__$W._withStripped = true;

      /* style */
      var __vue_inject_styles__$W = function (inject) {
        if (!inject) { return }
        inject("data-v-5166239b_0", { source: "\n.nav-link.active[data-v-5166239b] {\n    border-bottom: 1px solid transparent;\n}\n.nav-link[data-v-5166239b]:hover {\n    cursor: pointer;\n}\n.nav-link.disabled[data-v-5166239b]:hover {\n    cursor: not-allowed;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/tabs/_TabButton.vue"],"names":[],"mappings":";AAsHA;IACA,qCAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,oBAAA;CACA","file":"_TabButton.vue","sourcesContent":["<template>\n    <li :class=\"['nav-item', itemClass]\" role=\"presentation\">\n        <a :class=\"[\n            'nav-link',\n            active ? 'active' : '',\n            disabled ? 'disabled' : '',\n            linkClass\n        ]\"\n        role=\"tab\"\n        tabindex=\"-1\"\n        :id=\"computedID\"\n        :disabled=\"disabled\"\n        :aria-selected=\"active ? 'true' : 'false'\"\n        :aria-setsize=\"setSize\"\n        :aria-posinset=\"posInSet\"\n        :aria-controls=\"controls\"\n        v-html=\"content\"\n        @click=\"handleClick\"\n        @keydown=\"handleClick\" />\n    </li>\n</template>\n\n<script>\nimport { guid } from '../../utils'\nimport { KEYCODES } from '../../utils/constants';\n\nexport default {\n    name: 'd-tab-button',\n    props: {\n        /**\n         * The element ID.\n         */\n        id: {\n            type: String,\n            default: null\n        },\n        /**\n         * The active state.\n         */\n        active: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The disabled state.\n         */\n        disabled: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The link class.\n         */\n        linkClass: {\n            type: String,\n            default: null\n        },\n        /**\n         * The item class.\n         */\n        itemClass: {\n            type: String,\n            default: null\n        },\n        /**\n         * The aria-setsize value.\n         */\n        setSize: {\n            type: Number,\n            default: 0,\n        },\n        /**\n         * The position in set value (aria-posinset).\n         */\n        posInSet: {\n            type: Number,\n            default: 0,\n        },\n        /**\n         * The aria-controls value.\n         */\n        controls: {\n            type: String,\n            default: null\n        },\n        /**\n         * The content.\n         */\n        content: {\n            type: String,\n            default: null\n        }\n    },\n    methods: {\n        handleClick(e) {\n            if (this.disabled) {\n                e.preventDefault()\n                e.stopPropagation()\n            }\n\n            if (e.type === 'click'\n                || e.keyCode === KEYCODES.ENTER\n                || e.keyCode === KEYCODES.SPACE) {\n                e.preventDefault()\n                e.stopPropagation()\n                this.$emit('click', e)\n            }\n        }\n    },\n    computed: {\n        computedID() {\n            return this.id || `d-tab-btn-${guid()}`\n        }\n    }\n}\n</script>\n\n<style scoped>\n.nav-link.active {\n    border-bottom: 1px solid transparent;\n}\n\n.nav-link:hover {\n    cursor: pointer;\n}\n\n.nav-link.disabled:hover {\n    cursor: not-allowed;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$W = "data-v-5166239b";
      /* module identifier */
      var __vue_module_identifier__$W = undefined;
      /* functional template */
      var __vue_is_functional_template__$W = false;
      /* component normalizer */
      function __vue_normalize__$W(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/tabs/_TabButton.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$W() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$W.styles || (__vue_create_injector__$W.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dTabButton = __vue_normalize__$W(
        { render: __vue_render__$W, staticRenderFns: __vue_staticRenderFns__$W },
        __vue_inject_styles__$W,
        __vue_script__$W,
        __vue_scope_id__$W,
        __vue_is_functional_template__$W,
        __vue_module_identifier__$W,
        __vue_create_injector__$W,
        undefined
      );

    //

    var script$X = {
        name: 'd-tabs',
        components: {
            dTabButton: dTabButton
        },
        data: function data() {
            return {
                currentTab: this.value,
                tabs: [],
                // eslint-disable-next-line
                _tabsContainerID: null
            }
        },
        watch: {
            currentTab: function currentTab (newVal, oldVal) {
                if (newVal === oldVal) {
                    return
                }

                this.$emit('input', newVal);
                this.tabs[newVal].$emit('click');
            },
            value: function value (newVal, oldVal) {
                if (newVal === oldVal) {
                    return
                }

                if (typeof oldVal !== 'number') {
                    oldVal = 0;
                }

                var direction = newVal < oldVal ? -1 : 1;
                this.setTab(newVal, false, direction);
            }
        },
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Whether it should be displayed as a card, or not.
             */
            card: {
                type: Boolean,
                default: false
            },
            /**
             * The value used to set the current tab.
             */
            value: {
                type: Number,
                default: null
            },
            /**
             * Whether the tab controls should be displayed as pills, or not.
             */
            pills: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the tab controls should be displayed vertically, or not.
             */
            vertical: {
                type: Boolean,
                default: false
            },
            /**
             * The content class.
             */
            contentClass: {
                type: String,
                default: null
            },
            /**
             * The nav class.
             */
            navClass: {
                type: String,
                default: null
            },
            /**
             * The nav wrapper class.
             */
            navWrapperClass: {
                type: String,
                default: null
            }
        },
        computed: {
            computedID: function computedID() {
                return this.id || ("dr-tabs-" + (guid()))
            },
            computedTabControlsID: function computedTabControlsID() {
                return ("dr-tab-controls-" + (guid()))
            },
            computedTabButtonID: function computedTabButtonID() {
                return ("dr-tabs-tab-" + (guid()))
            },
            navStyle: function navStyle() {
                return this.pills ? 'pills' : 'tabs'
            },
            computedTabsClasses: function computedTabsClasses() {
                return [
                    'tabs',
                    this.vertical ? 'row' : '',
                    (this.vertical && this.card) ? 'no-gutters' : '' ]
            },
            computedNavListClasses: function computedNavListClasses() {
                return [
                    'nav',
                    ("nav-" + (this.navStyle)),
                    (this.card && !this.vertical) ? ("card-header-" + (this.navStyle)) : '',
                    (this.card && this.vertical) ? 'card-header' : '',
                    (this.card && this.vertical) ? 'h-100' : '',
                    this.vertical ? 'flex-column' : '',
                    this.vertical ? 'border-bottom-0' : '',
                    this.vertical ? 'rounded-0' : '',
                    this.vertical ? 'd-tabs-vertical-nav' : '',
                    this.navClass
                ]
            },
            computedNavListWrapperClasses: function computedNavListWrapperClasses() {
                return [
                    this.card && !this.vertical ? 'card-header' : '',
                    this.vertical ? 'col-auto' : '',
                    this.navWrapperClass
                ]
            },
            computedTabsContainerClasses: function computedTabsContainerClasses() {
                return [
                    'tab-content',
                    this.vertical ? 'col' : '',
                    this.contentClass
                ]
            }
        },
        created: function created() {
            this._tabsContainerID = "tabs-container-" + (guid());
        },
        methods: {
            handleOnKeynav: function handleOnKeynav(e) {
                if (Object.keys(KEYCODES).some(function (k) { return KEYCODES[k] === e.keyCode; })) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (e.keyCode === KEYCODES.UP || e.keyCode === KEYCODES.LEFT ) {
                    this.previousTab();
                }

                if (e.keyCode === KEYCODES.DOWN || e.keyCode === KEYCODES.RIGHT) {
                    this.nextTab();
                }
            },
            nextTab: function nextTab() {
                this.setTab(this.currentTab + 1, false, 1);
            },
            previousTab: function previousTab() {
                this.setTab(this.currentTab - 1, false, -1);
            },
            setTab: function setTab(index, force, direction) {
                var this$1 = this;

                direction = direction || 0;
                index = index || 0;

                direction = direction === 0 ? 0 : (direction > 0 ? 1 : -1);

                if (!force && index === this.currentTab) {
                    return
                }

                var tab = this.tabs[index];

                if (!tab) {
                    this.$emit('input', this.currentTab);
                    return
                }

                if (tab.disabled) {
                    if (direction) {
                        this.setTab(index + direction, force, direction);
                    }

                    return
                }

                this.tabs.forEach(function (_tab) {
                    if (_tab === tab) {
                        this$1.$set(_tab, 'localActiveState', true);
                        return
                    }

                    this$1.$set(_tab, 'localActiveState', false);
                });

                this.currentTab = index;
            },
            updateTabs: function updateTabs() {
                this.tabs = this.$children.filter(function (child) { return child._isTab; });
                var tabIndex = null;

                this.tabs.forEach(function (tab, index) {
                    if (tab.localActiveState && !tab.disabled) {
                        tabIndex = index;
                    }
                });

                if (tabIndex === null) {
                    if (this.currentTab >= this.tabs.length) {
                        this.setTab(this.tabs.length - 1, true, -1);
                        return
                    }

                    if (this.tabs[this.currentTab] && !this.tabs[this.currentTab].disabled) {
                        tabIndex = this.currentTab;
                    }

                    this.tabs.forEach(function (tab, index) {
                        if (!tab.disabled && tabIndex === null) {
                            tabIndex = index;
                        }
                    });
                }

                this.setTab(tabIndex || 0, true, 0);
            }
        },
        mounted: function mounted() {
            this.updateTabs();
        }
    };

    /* script */
                var __vue_script__$X = script$X;
                
    /* template */
    var __vue_render__$X = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        _vm.tag,
        {
          tag: "component",
          class: _vm.computedTabsClasses,
          attrs: { id: _vm.computedID }
        },
        [
          _c("div", { class: _vm.computedNavListWrapperClasses }, [
            _c(
              "ul",
              {
                class: _vm.computedNavListClasses,
                attrs: {
                  role: "tablist",
                  tabindex: "0",
                  id: _vm.computedTabControlsID
                },
                on: { keydown: _vm.handleOnKeynav }
              },
              [
                _vm._l(_vm.tabs, function(tab, index) {
                  return _c("d-tab-button", {
                    key: index,
                    attrs: {
                      content: tab.headHtml || tab.title,
                      href: tab.href,
                      id: _vm.computedTabButtonID,
                      active: tab.localActiveState,
                      disabled: tab.disabled,
                      setSize: _vm.tabs.length,
                      posInSet: index + 1,
                      controls: _vm._tabsContainerID,
                      linkClass: tab.titleLinkClass,
                      itemClass: tab.titleItemClass
                    },
                    on: {
                      click: function($event) {
                        _vm.setTab(index);
                      }
                    }
                  })
                }),
                _vm._v(" "),
                _vm._t("tabs")
              ],
              2
            )
          ]),
          _vm._v(" "),
          _c(
            "div",
            {
              ref: "tabsContainer",
              class: _vm.computedTabsContainerClasses,
              attrs: { id: _vm._tabsContainerID }
            },
            [_vm._t("default")],
            2
          )
        ]
      )
    };
    var __vue_staticRenderFns__$X = [];
    __vue_render__$X._withStripped = true;

      /* style */
      var __vue_inject_styles__$X = function (inject) {
        if (!inject) { return }
        inject("data-v-44a67609_0", { source: "\n.d-tabs-vertical-nav[data-v-44a67609]:hover {\n    background: rgba(90, 97, 105, 0.06);\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/tabs/Tabs.vue"],"names":[],"mappings":";AA8RA;IACA,oCAAA;CACA","file":"Tabs.vue","sourcesContent":["<template>\n    <component :is=\"tag\"\n        :id=\"computedID\"\n        :class=\"computedTabsClasses\">\n\n        <div :class=\"computedNavListWrapperClasses\">\n            <ul :class=\"computedNavListClasses\"\n            role=\"tablist\"\n            tabindex='0'\n            :id=\"computedTabControlsID\"\n            @keydown=\"handleOnKeynav\">\n                <d-tab-button v-for=\"(tab, index) in tabs\" :key=\"index\"\n                    :content=\"tab.headHtml || tab.title\"\n                    :href=\"tab.href\"\n                    :id=\"computedTabButtonID\"\n                    :active=\"tab.localActiveState\"\n                    :disabled=\"tab.disabled\"\n                    :setSize=\"tabs.length\"\n                    :posInSet=\"index + 1\"\n                    :controls=\"_tabsContainerID\"\n                    :linkClass=\"tab.titleLinkClass\"\n                    :itemClass=\"tab.titleItemClass\"\n                    @click=\"setTab(index)\" />\n                <slot name=\"tabs\" />\n            </ul>\n        </div>\n\n        <div ref=\"tabsContainer\"\n            :class=\"computedTabsContainerClasses\"\n            :id=\"_tabsContainerID\">\n            <slot />\n        </div>\n    </component>\n</template>\n\n<script>\nimport { guid } from '../../utils'\nimport { KEYCODES } from '../../utils/constants'\nimport dTabButton from './_TabButton.vue'\n\nexport default {\n    name: 'd-tabs',\n    components: {\n        dTabButton\n    },\n    data() {\n        return {\n            currentTab: this.value,\n            tabs: [],\n            // eslint-disable-next-line\n            _tabsContainerID: null\n        }\n    },\n    watch: {\n        currentTab (newVal, oldVal) {\n            if (newVal === oldVal) {\n                return\n            }\n\n            this.$emit('input', newVal)\n            this.tabs[newVal].$emit('click')\n        },\n        value (newVal, oldVal) {\n            if (newVal === oldVal) {\n                return\n            }\n\n            if (typeof oldVal !== 'number') {\n                oldVal = 0\n            }\n\n            const direction = newVal < oldVal ? -1 : 1\n            this.setTab(newVal, false, direction)\n        }\n    },\n    props: {\n        /**\n         * The element ID.\n         */\n        id: {\n            type: String,\n            default: null\n        },\n        /**\n         * The element tag.\n         */\n        tag: {\n            type: String,\n            default: 'div'\n        },\n        /**\n         * Whether it should be displayed as a card, or not.\n         */\n        card: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The value used to set the current tab.\n         */\n        value: {\n            type: Number,\n            default: null\n        },\n        /**\n         * Whether the tab controls should be displayed as pills, or not.\n         */\n        pills: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether the tab controls should be displayed vertically, or not.\n         */\n        vertical: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The content class.\n         */\n        contentClass: {\n            type: String,\n            default: null\n        },\n        /**\n         * The nav class.\n         */\n        navClass: {\n            type: String,\n            default: null\n        },\n        /**\n         * The nav wrapper class.\n         */\n        navWrapperClass: {\n            type: String,\n            default: null\n        }\n    },\n    computed: {\n        computedID() {\n            return this.id || `dr-tabs-${guid()}`\n        },\n        computedTabControlsID() {\n            return `dr-tab-controls-${guid()}`\n        },\n        computedTabButtonID() {\n            return `dr-tabs-tab-${guid()}`\n        },\n        navStyle() {\n            return this.pills ? 'pills' : 'tabs'\n        },\n        computedTabsClasses() {\n            return [\n                'tabs',\n                this.vertical ? 'row' : '',\n                (this.vertical && this.card) ? 'no-gutters' : '',\n            ]\n        },\n        computedNavListClasses() {\n            return [\n                'nav',\n                `nav-${this.navStyle}`,\n                (this.card && !this.vertical) ? `card-header-${this.navStyle}` : '',\n                (this.card && this.vertical) ? 'card-header' : '',\n                (this.card && this.vertical) ? 'h-100' : '',\n                this.vertical ? 'flex-column' : '',\n                this.vertical ? 'border-bottom-0' : '',\n                this.vertical ? 'rounded-0' : '',\n                this.vertical ? 'd-tabs-vertical-nav' : '',\n                this.navClass\n            ]\n        },\n        computedNavListWrapperClasses() {\n            return [\n                this.card && !this.vertical ? 'card-header' : '',\n                this.vertical ? 'col-auto' : '',\n                this.navWrapperClass\n            ]\n        },\n        computedTabsContainerClasses() {\n            return [\n                'tab-content',\n                this.vertical ? 'col' : '',\n                this.contentClass\n            ]\n        }\n    },\n    created() {\n        this._tabsContainerID = `tabs-container-${guid()}`\n    },\n    methods: {\n        handleOnKeynav(e) {\n            if (Object.keys(KEYCODES).some((k) => KEYCODES[k] === e.keyCode)) {\n                e.preventDefault()\n                e.stopPropagation()\n            }\n\n            if (e.keyCode === KEYCODES.UP || e.keyCode === KEYCODES.LEFT ) {\n                this.previousTab()\n            }\n\n            if (e.keyCode === KEYCODES.DOWN || e.keyCode === KEYCODES.RIGHT) {\n                this.nextTab()\n            }\n        },\n        nextTab() {\n            this.setTab(this.currentTab + 1, false, 1)\n        },\n        previousTab() {\n            this.setTab(this.currentTab - 1, false, -1)\n        },\n        setTab(index, force, direction) {\n            direction = direction || 0\n            index = index || 0\n\n            direction = direction === 0 ? 0 : (direction > 0 ? 1 : -1)\n\n            if (!force && index === this.currentTab) {\n                return\n            }\n\n            const tab = this.tabs[index]\n\n            if (!tab) {\n                this.$emit('input', this.currentTab)\n                return\n            }\n\n            if (tab.disabled) {\n                if (direction) {\n                    this.setTab(index + direction, force, direction)\n                }\n\n                return\n            }\n\n            this.tabs.forEach(_tab => {\n                if (_tab === tab) {\n                    this.$set(_tab, 'localActiveState', true)\n                    return\n                }\n\n                this.$set(_tab, 'localActiveState', false)\n            })\n\n            this.currentTab = index\n        },\n        updateTabs() {\n            this.tabs = this.$children.filter(child => child._isTab)\n            let tabIndex = null\n\n            this.tabs.forEach((tab, index) => {\n                if (tab.localActiveState && !tab.disabled) {\n                    tabIndex = index\n                }\n            })\n\n            if (tabIndex === null) {\n                if (this.currentTab >= this.tabs.length) {\n                    this.setTab(this.tabs.length - 1, true, -1)\n                    return\n                }\n\n                if (this.tabs[this.currentTab] && !this.tabs[this.currentTab].disabled) {\n                    tabIndex = this.currentTab\n                }\n\n                this.tabs.forEach((tab, index) => {\n                    if (!tab.disabled && tabIndex === null) {\n                        tabIndex = index\n                    }\n                })\n            }\n\n            this.setTab(tabIndex || 0, true, 0)\n        }\n    },\n    mounted() {\n        this.updateTabs()\n    }\n}\n</script>\n\n<style scoped>\n.d-tabs-vertical-nav:hover {\n    background: rgba(90, 97, 105, 0.06);\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$X = "data-v-44a67609";
      /* module identifier */
      var __vue_module_identifier__$X = undefined;
      /* functional template */
      var __vue_is_functional_template__$X = false;
      /* component normalizer */
      function __vue_normalize__$X(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/tabs/Tabs.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$X() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$X.styles || (__vue_create_injector__$X.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dTabs = __vue_normalize__$X(
        { render: __vue_render__$X, staticRenderFns: __vue_staticRenderFns__$X },
        __vue_inject_styles__$X,
        __vue_script__$X,
        __vue_scope_id__$X,
        __vue_is_functional_template__$X,
        __vue_module_identifier__$X,
        __vue_create_injector__$X,
        undefined
      );

    //

    var script$Y = {
        name: 'd-tab',
        data: function data() {
            return {
                localActiveState: this.active && !this.disabled,
                show: false
            }
        },
        props: {
            /**
             * The element ID.
             */
            id: {
                type: String,
                default: null
            },
            /**
             * The active state.
             */
            active: {
                type: Boolean,
                default: false
            },
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The button ID.
             */
            buttonId: {
                type: String,
                default: ''
            },
            /**
             * The title.
             */
            title: {
                type: String,
                default: ''
            },
            /**
             * The disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
            /**
             * Whether the card should display the body, or not.
             */
            noBody: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedID: function computedID() {
                return this.id || ("dr-tab-" + (guid()))
            },
            controlledBy: function controlledBy() {
                return this.buttonId || ("dr-tab-button-" + (guid()))
            },
            computedFade: function computedFade() {
                return this.$parent.fade
            },
            _isTab: function _isTab() {
                return true
            }
        },
        methods: {
            handleBeforeEnter: function handleBeforeEnter() {
                this.show = false;
            },
            handleAfterEnter: function handleAfterEnter() {
                this.show = true;
            },
            handleAfterLeave: function handleAfterLeave() {
                this.show = false;
            }
        },
        mounted: function mounted() {
            this.show = this.localActiveState;
        }
    };

    /* script */
                var __vue_script__$Y = script$Y;
                
    /* template */
    var __vue_render__$Y = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "transition",
        {
          attrs: { mode: "out-in", name: "fade" },
          on: {
            beforeEnter: _vm.handleBeforeEnter,
            afterEnter: _vm.handleAfterEnter,
            afterLeave: _vm.handleAfterLeave
          }
        },
        [
          _c(
            _vm.tag,
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.localActiveState,
                  expression: "localActiveState"
                }
              ],
              ref: "panel",
              tag: "component",
              class: [
                "tab-pane",
                _vm.$parent && _vm.$parent.card && !_vm.noBody ? "card-body" : "",
                _vm.show ? "show" : "",
                _vm.disabled ? "disabled" : "",
                _vm.localActiveState ? "active" : ""
              ],
              attrs: {
                role: "tabpanel",
                id: _vm.computedID,
                "aria-hidden": _vm.localActiveState ? "false" : "true",
                "aria-expanded": _vm.localActiveState ? "true" : "false",
                "aria-labelledby": _vm.controlledBy || null
              }
            },
            [_vm._t("default")],
            2
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$Y = [];
    __vue_render__$Y._withStripped = true;

      /* style */
      var __vue_inject_styles__$Y = function (inject) {
        if (!inject) { return }
        inject("data-v-358f9cd2_0", { source: "\n.fade-enter-active[data-v-358f9cd2] {\n  transition: opacity .25s ease-in-out;\n}\n.fade-leave-active[data-v-358f9cd2] {\n  transition: opacity .25s cubic-bezier(1.0, 0.5, 0.8, 1.0);\n}\n.fade-enter[data-v-358f9cd2],\n.fade-leave-to[data-v-358f9cd2] {\n  opacity: 0;\n}\n", map: {"version":3,"sources":["/Users/hisk/Projects/GitHub/shards-vue/src/components/tabs/Tab.vue"],"names":[],"mappings":";AAuHA;EACA,qCAAA;CACA;AAEA;EACA,0DAAA;CACA;AAEA;;EAEA,WAAA;CACA","file":"Tab.vue","sourcesContent":["<template>\n    <transition mode=\"out-in\" name=\"fade\"\n        @beforeEnter=\"handleBeforeEnter\"\n        @afterEnter=\"handleAfterEnter\"\n        @afterLeave=\"handleAfterLeave\">\n        <component :is=\"tag\"\n            ref=\"panel\"\n            v-show=\"localActiveState\"\n            role=\"tabpanel\"\n            :id=\"computedID\"\n            :aria-hidden=\"localActiveState ? 'false' : 'true'\"\n            :aria-expanded=\"localActiveState ? 'true' : 'false'\"\n            :aria-labelledby=\"controlledBy || null\"\n            :class=\"[\n                'tab-pane',\n                ($parent && $parent.card && !noBody) ? 'card-body' : '',\n                show ? 'show' : '',\n                disabled ? 'disabled' : '',\n                localActiveState ? 'active' : ''\n            ]\">\n            <slot />\n        </component>\n    </transition>\n</template>\n\n<script>\nimport { guid } from '../../utils';\n\nexport default {\n    name: 'd-tab',\n    data() {\n        return {\n            localActiveState: this.active && !this.disabled,\n            show: false\n        }\n    },\n    props: {\n        /**\n         * The element ID.\n         */\n        id: {\n            type: String,\n            default: null\n        },\n        /**\n         * The active state.\n         */\n        active: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * The element tag.\n         */\n        tag: {\n            type: String,\n            default: 'div'\n        },\n        /**\n         * The button ID.\n         */\n        buttonId: {\n            type: String,\n            default: ''\n        },\n        /**\n         * The title.\n         */\n        title: {\n            type: String,\n            default: ''\n        },\n        /**\n         * The disabled state.\n         */\n        disabled: {\n            type: Boolean,\n            default: false\n        },\n        /**\n         * Whether the card should display the body, or not.\n         */\n        noBody: {\n            type: Boolean,\n            default: false\n        }\n    },\n    computed: {\n        computedID() {\n            return this.id || `dr-tab-${guid()}`\n        },\n        controlledBy() {\n            return this.buttonId || `dr-tab-button-${guid()}`\n        },\n        computedFade() {\n            return this.$parent.fade\n        },\n        _isTab() {\n            return true\n        }\n    },\n    methods: {\n        handleBeforeEnter() {\n            this.show = false\n        },\n        handleAfterEnter() {\n            this.show = true\n        },\n        handleAfterLeave() {\n            this.show = false\n        }\n    },\n    mounted() {\n        this.show = this.localActiveState\n    }\n}\n</script>\n\n<style scoped>\n.fade-enter-active {\n  transition: opacity .25s ease-in-out;\n}\n\n.fade-leave-active {\n  transition: opacity .25s cubic-bezier(1.0, 0.5, 0.8, 1.0);\n}\n\n.fade-enter,\n.fade-leave-to {\n  opacity: 0;\n}\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__$Y = "data-v-358f9cd2";
      /* module identifier */
      var __vue_module_identifier__$Y = undefined;
      /* functional template */
      var __vue_is_functional_template__$Y = false;
      /* component normalizer */
      function __vue_normalize__$Y(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/tabs/Tab.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        {
          var hook;
          if (style) {
            hook = function(context) {
              style.call(this, createInjector(context));
            };
          }

          if (hook !== undefined) {
            if (component.functional) {
              // register for functional component in vue file
              var originalRender = component.render;
              component.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context)
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = component.beforeCreate;
              component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }
        }

        return component
      }
      /* style inject */
      function __vue_create_injector__$Y() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$Y.styles || (__vue_create_injector__$Y.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dTab = __vue_normalize__$Y(
        { render: __vue_render__$Y, staticRenderFns: __vue_staticRenderFns__$Y },
        __vue_inject_styles__$Y,
        __vue_script__$Y,
        __vue_scope_id__$Y,
        __vue_is_functional_template__$Y,
        __vue_module_identifier__$Y,
        __vue_create_injector__$Y,
        undefined
      );

    var components$s = {
        dTabs: dTabs,
        dTab: dTab
    };

    var VuePlugin$s = {
      install: function install (Vue) {
        registerComponents(Vue, components$s);
      }
    };

    vueUse(VuePlugin$s);

    var TooltipDefaults = {
        template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
    };

    var Defaults$3 = Object.assign({}, TPManager.Defaults, TooltipDefaults);

    var Tooltip = (function (TPManager$$1) {
        function Tooltip () {
            TPManager$$1.apply(this, arguments);
        }

        if ( TPManager$$1 ) Tooltip.__proto__ = TPManager$$1;
        Tooltip.prototype = Object.create( TPManager$$1 && TPManager$$1.prototype );
        Tooltip.prototype.constructor = Tooltip;

        var staticAccessors = { Name: { configurable: true },Defaults: { configurable: true },ClassPrefix: { configurable: true } };

        staticAccessors.Name.get = function () {
            return 'tooltip'
        };

        staticAccessors.Defaults.get = function () {
            return Defaults$3
        };

        staticAccessors.ClassPrefix.get = function () {
            return 'bs-tooltip'
        };

        /*--------------------------------------------------------------------------
        /* OVERRIDES
        /*--------------------------------------------------------------------------*/

        /**
         * Checks whether the Tooltip has any content.
         */
        Tooltip.prototype.hasContent = function hasContent (TPElement) {
            var Tooltip = TPElement || this._TPElement;

            if (!Tooltip) {
                return false
            }

            var tooltipInnerEl = selectElement(TOOLTIP_SELECTORS.TOOLTIP_INNER, Tooltip);

            return Boolean((tooltipInnerEl || {}).innerHTML)
        };

        /**
         * Sets the Tooltip content.
         */
        Tooltip.prototype.setContent = function setContent (TPElement) {
            var Tooltip = TPElement || this._TPElement;

            if (!Tooltip) {
                return false
            }

            var tooltipInnerEl = selectElement(TOOLTIP_SELECTORS.TOOLTIP_INNER, Tooltip);
            this.setElementContent(tooltipInnerEl, this.getTitle());

            removeClasses(Tooltip, [TP_STATE_CLASSES.FADE, TP_STATE_CLASSES.SHOW]);
        };

        Object.defineProperties( Tooltip, staticAccessors );

        return Tooltip;
    }(TPManager));

    //

    var script$Z = {
        name: 'd-tooltip',
        mixins: [ TooltipPopoverMixin ],
        props: {
            /**
             * Title.
             */
            title: {
                type: String,
                default: ''
            },
            /**
             * Triggers.
             */
            triggers: {
                type: [String, Array],
                default: 'hover focus'
            },
            /**
             * Placement.
             */
            placement: {
                type: String,
                default: 'top',
                validator: function (val) { return Object.keys(TP_PLACEMENTS).map(function (p) { return p.toLowerCase(); }).includes(val); }
            },
            /**
             * The target element.
             */
            target: {
                type: [String, Object, Function]
            },
            /**
             * Delay in miliseconds.
             */
            delay: {
                type: [Number, Object, String],
                default: 0
            },
            /**
             * Offset.
             */
            offset: {
                type: [Number, String]
            },
            /**
             * Disable animations.
             */
            noFade: {
                type: Boolean,
                default: false
            },
            /**
             * Wrapping container.
             */
            container: {
                type: String,
                default: null
            },
            /**
             * Instance boundaries.
             */
            boundary: {
                type: [String, Object],
                default: 'scrollParent'
            },
            /**
             * Show state.
             */
            show: {
                type: Boolean,
                default: false
            },
            /**
             * Disabled state.
             */
            disabled: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            /**
             * Gets the target and if the target exists, it initializes the Tooltip.
             * Used inside the TooltipPopoverMixin
             */
            bootstrap: function bootstrap() {
                var target = this.getTarget();

                if (target) {
                    this._TPInstance = new Tooltip(
                        target,
                        this.getUpdatedConfig(),
                        this.$root
                    );
                }

                return this._TPInstance
            }
        }
    };

    /* script */
                var __vue_script__$Z = script$Z;
                
    /* template */
    var __vue_render__$Z = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "d-none",
          staticStyle: { display: "none" },
          attrs: { "aria-hiden": "true" }
        },
        [_c("div", { ref: "title" }, [_vm._t("default")], 2)]
      )
    };
    var __vue_staticRenderFns__$Z = [];
    __vue_render__$Z._withStripped = true;

      /* style */
      var __vue_inject_styles__$Z = undefined;
      /* scoped */
      var __vue_scope_id__$Z = undefined;
      /* module identifier */
      var __vue_module_identifier__$Z = undefined;
      /* functional template */
      var __vue_is_functional_template__$Z = false;
      /* component normalizer */
      function __vue_normalize__$Z(
        template, style, script,
        scope, functional, moduleIdentifier,
        createInjector, createInjectorSSR
      ) {
        var component = (typeof script === 'function' ? script.options : script) || {};

        {
          component.__file = "/Users/hisk/Projects/GitHub/shards-vue/src/components/tooltip/Tooltip.vue";
        }

        if (!component.render) {
          component.render = template.render;
          component.staticRenderFns = template.staticRenderFns;
          component._compiled = true;

          if (functional) { component.functional = true; }
        }

        component._scopeId = scope;

        return component
      }
      /* style inject */
      function __vue_create_injector__$Z() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var styles = __vue_create_injector__$Z.styles || (__vue_create_injector__$Z.styles = {});
        var isOldIE =
          typeof navigator !== 'undefined' &&
          /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

        return function addStyle(id, css) {
          if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) { return } // SSR styles are present.

          var group = isOldIE ? css.media || 'default' : id;
          var style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

          if (!style.ids.includes(id)) {
            var code = css.source;
            var index = style.ids.length;

            style.ids.push(id);

            if (isOldIE) {
              style.element = style.element || document.querySelector('style[data-group=' + group + ']');
            }

            if (!style.element) {
              var el = style.element = document.createElement('style');
              el.type = 'text/css';

              if (css.media) { el.setAttribute('media', css.media); }
              if (isOldIE) {
                el.setAttribute('data-group', group);
                el.setAttribute('data-next-index', '0');
              }

              head.appendChild(el);
            }

            if (isOldIE) {
              index = parseInt(style.element.getAttribute('data-next-index'));
              style.element.setAttribute('data-next-index', index + 1);
            }

            if (style.element.styleSheet) {
              style.parts.push(code);
              style.element.styleSheet.cssText = style.parts
                .filter(Boolean)
                .join('\n');
            } else {
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) { style.element.removeChild(nodes[index]); }
              if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }
              else { style.element.appendChild(textNode); }
            }
          }
        }
      }
      /* style inject SSR */
      

      
      var dTooltip = __vue_normalize__$Z(
        { render: __vue_render__$Z, staticRenderFns: __vue_staticRenderFns__$Z },
        __vue_inject_styles__$Z,
        __vue_script__$Z,
        __vue_scope_id__$Z,
        __vue_is_functional_template__$Z,
        __vue_module_identifier__$Z,
        __vue_create_injector__$Z,
        undefined
      );

    var components$t = {
        dTooltip: dTooltip
    };

    var VuePlugin$t = {
      install: function install (Vue) {
        registerComponents(Vue, components$t);
      }
    };

    vueUse(VuePlugin$t);



    var components$u = /*#__PURE__*/Object.freeze({
        Alert: VuePlugin,
        Badge: VuePlugin$1,
        Breadcrumb: VuePlugin$2,
        Button: VuePlugin$3,
        ButtonGroup: VuePlugin$4,
        ButtonToolbar: VuePlugin$5,
        Card: VuePlugin$6,
        Collapse: VuePlugin$7,
        Layout: VuePlugin$8,
        Datepicker: VuePlugin$9,
        Dropdown: VuePlugin$a,
        Embed: VuePlugin$b,
        Form: VuePlugin$c,
        FormCheckbox: VuePlugin$d,
        FormInput: VuePlugin$e,
        FormRadio: VuePlugin$f,
        FormSelect: VuePlugin$g,
        FormTextarea: VuePlugin$h,
        Image: VuePlugin$i,
        InputGroup: VuePlugin$j,
        Link: VuePlugin$k,
        ListGroup: VuePlugin$l,
        Modal: VuePlugin$m,
        Nav: VuePlugin$n,
        Navbar: VuePlugin$o,
        Popover: VuePlugin$p,
        Progress: VuePlugin$q,
        Slider: VuePlugin$r,
        Tabs: VuePlugin$s,
        Tooltip: VuePlugin$t
    });

    var allListenTypes = {
        hover: true,
        click: true,
        focus: true
    };

    var BEL_KEY = '__DR_BOUND_EVENT_LISTENERS__';

    var bindTargets = function (vnode, binding, listenTypes, callback) {
        var targets = Object.keys(binding.modifiers || {}).filter(function (t) { return !allListenTypes[t]; });

        if (binding.value) {
            targets.push(binding.value);
        }

        var listener = function () {
            callback({ targets: targets, vnode: vnode });
        };

        Object.keys(allListenTypes).forEach(function (type) {
            if (listenTypes[type] || binding.modifiers[type]) {
                vnode.elm.addEventListener(type, listener);
                var boundListeners = vnode.elm[BEL_KEY] || {};
                boundListeners[type] = boundListeners[type] || [];
                boundListeners[type].push(listener);
                vnode.elm[BEL_KEY] = boundListeners;
            }
        });

        return targets
    };

    var inBrowser = typeof window !== 'undefined';
    var DR_TOGGLE = '__DRTOGGLE';

    var dToggle = {
        bind: function bind(element, binding, vnode) {
            var targets = bindTargets(vnode, binding, { click: true }, function (ref) {
                var targets = ref.targets;
                var vnode = ref.vnode;

                targets.forEach(function (target) { return vnode.context.$root.$emit(COLLAPSE_EVENTS.TOGGLE, target); });
            });

            if (inBrowser && vnode.context && targets.length > 0) {
                setAttr(element, 'aria-controls', targets.join(' '));
                setAttr(element, 'aria-expanded', 'false');

                if (element.tagName !== 'BUTTON') {
                    setAttr(element, 'role', 'button');
                }

                element[DR_TOGGLE] = function toggleDirectiveHandler(id, state) {
                    if (targets.indexOf(id) !== -1) {
                        setAttr(element, 'aria-expanded', state ? 'true' : 'false');

                        if (state) {
                            removeClass(element, 'collapsed');
                            return;
                        }

                        addClass(element, 'collapsed');
                    }
                };
                vnode.context.$root.$on(COLLAPSE_EVENTS.STATE, element[DR_TOGGLE]);
            }
        },
        unbind: function unbind(element, binding, vnode) {
            if (!element[DR_TOGGLE]) {
                return
            }

            vnode.context.$root.$off(COLLAPSE_EVENTS.STATE, element[DR_TOGGLE]);
            element[DR_TOGGLE] = null;
        }
    };

    var directives = {
      dToggle: dToggle
    };

    var VuePlugin$u = {
      install: function install (Vue) {
        registerDirectives(Vue, directives);
      }
    };

    vueUse(VuePlugin$u);

    var inBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined';
    var KEY = '_DR_TOOLTIP_';
    var validTriggers = {
        'focus': true,
        'hover': true,
        'click': true,
        'blur': true
    };

    /**
     * Bindings parser.
     */
    function parseBindings(bindings) {
        var config = {};

        switch (typeof bindings.value) {
            case 'string':
            case 'function':
                config.title = bindings.value;
                break
            case 'object':
                config = Object.assign({}, bindings.value);
        }

        // Parse args (eg: v-d-tooltip:my-container)
        if (bindings.arg) {
            config.container = "#" + (bindings.arg); // #my-container
        }

        // Parse modifiers. eg: v-d-tooltip.my-modifier
        Object.keys(bindings.modifiers).forEach(function (mod) {
            // Parse if the title allows HTML
            if (/^html$/.test(mod)) {
                config.html = true;

            // Parse animation
            } else if (/^nofade$/.test(mod)) {
                config.animation = false;

            // Parse placement
            } else if (/^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(mod)) {
                config.placement = mod;

            // Parse boundary
            } else if (/^(window|viewport)$/.test(mod)) {
                config.boundary = mod;

            // Parse delay
            } else if (/^d\d+$/.test(mod)) {
                var delay = parseInt(mod.slice(1), 10) || 0;
                if (delay) {
                    config.delay = delay;
                }

            // Parse offset
            }  else if (/^o-?\d+$/.test(mod)) {
                var offset = parseInt(mod.slice(1), 10) || 0;
                if (offset) {
                    config.offset = offset;
                }
            }
        });

        // Parse selected triggers.
        var selectedTriggers = {};
        var triggers = typeof config.trigger === 'string' ? config.trigger.trim().split(/\s+/) : [];

        triggers.forEach(function (trigger) {
            if (validTriggers[trigger]) {
                selectedTriggers[trigger] = true;
            }
        });

        // Parse trigger modifiers. eg: v-d-tooltip.click
        Object.keys(validTriggers).forEach(function (trigger) {
            if (bindings.modifiers[trigger]) {
                selectedTriggers[trigger] = true;
            }
        });

        config.trigger = Object.keys(selectedTriggers).join(' ');

        // Convert `blur` to `focus`
        if (config.trigger === 'blur') {
            config.trigger = 'focus';
        }

        // If there's no trigger assigned, just delete the key.
        if (!config.trigger) {
            delete config.trigger;
        }

        return config
    }

    function applyTooltip(el, bindings, vnode) {
        if (!inBrowser$1) {
            return
        }

        var parsedBindings = parseBindings(bindings);

        if (!el[KEY]) {
            el[KEY] = new Tooltip(el, parsedBindings, vnode.context.$root);
            return
        }

        el[KEY].updateConfig(parsedBindings);
    }

    var dTooltip$1 = {
        bind: function bind (el, bindings, vnode) {
            applyTooltip(el, bindings, vnode);
        },

        inserted: function inserted(el, bindings, vnode) {
            applyTooltip(el, bindings, vnode);
        },

        update: function update (el, bindings, vnode) {
            if (bindings.value !== bindings.oldValue) {
                applyTooltip(el, bindings, vnode);
            }
        },

        componentUpdated: function componentUpdated (el, bindings, vnode) {
            if (bindings.value !== bindings.oldValue) {
                applyTooltip(el, bindings, vnode);
            }
        },

        unbind: function unbind (el) {
            if (!inBrowser$1) {
                return
            }

            if (el[KEY]) {
                el[KEY].destroy();
                el[KEY] = null;
                delete el[KEY];
            }
        }
    };

    var directives$1 = {
      dTooltip: dTooltip$1
    };

    var VuePlugin$v = {
      install: function install (Vue) {
        registerDirectives(Vue, directives$1);
      }
    };

    vueUse(VuePlugin$v);



    var directives$2 = /*#__PURE__*/Object.freeze({
        dToggle: VuePlugin$u,
        dTooltip: VuePlugin$v
    });

    var VuePlugin$w = {
      install: function (Vue) {
        if (Vue._shards_vue_installed) {
          return
        }

        Vue._shards_vue_installed = true;

        // Register component plugins
        for (var component in components$u) {
          Vue.use(components$u[component]);
        }

        // Register directive plugins
        for (var directive in directives$2) {
          Vue.use(directives$2[directive]);
        }
      }
    };

    vueUse(VuePlugin$w);

    return VuePlugin$w;

})));
//# sourceMappingURL=shards-vue.umd.js.map
