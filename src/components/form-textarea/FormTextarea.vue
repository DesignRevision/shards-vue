<template>
  <textarea
    ref="input"
    :class="[
            plaintext ? 'form-control-plaintext' : 'form-control',
            plaintext ? 'w-100' : '',
            size ? `form-control-${this.size}` : null,
            stateClass
        ]"
    :style="computedStyle"
    :name="name"
    :id="computedID"
    :disabled="disabled"
    :required="required"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :readonly="readonly || plaintext"
    :rows="rows"
    :wrap="wrap"
    :aria-required="required ? 'true' : null"
    :aria-invalid="computedAriaInvalid"
    @input="handleInput"
  ></textarea>
</template>

<script>
import { guid, getComputedStyles, isVisible } from "../../utils";

export default {
  name: "d-form-textarea",
  data() {
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
      validator: v => ["valid", "invalid", true, false, null].includes(v)
    },
    /**
     * The element's size.
     */
    size: {
      type: String,
      default: null,
      validator: v => ["sm", "lg", null].includes(v)
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
      validator: v => ["soft", "hard", "off"].includes(v)
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
  mounted() {
    this.el = this.$el;
  },
  computed: {
    computedID() {
      return this.id || `dr-textarea-${guid()}`;
    },
    computedStyle() {
      return {
        width: this.plaintext ? "100%" : null,
        height: this.computedHeight,
        resize: this.noResize ? "none" : null
      };
    },
    computedMinRows() {
      return Math.max(parseInt(this.rows, 10) || 2, 2);
    },
    computedMaxRows() {
      return Math.max(this.computedMinRows, parseInt(this.maxRows, 10) || 0);
    },
    computedHeight() {
      if (this.localValue === null || !isVisible(this.el)) {
        return null;
      }

      const _height = this.el.style.height;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.el.style.height = "inherit";

      const computed = getComputedStyles(this.el);
      const minHeight =
        parseInt(computed.height, 10) || lineHeight * this.computedMinRows;

      const lineHeight = parseFloat(computed.lineHeight);
      const offset =
        parseInt(computed.borderTopWidth, 10) +
        parseInt(computed.paddingTop, 10) +
        parseInt(computed.paddingBottom, 10) +
        parseInt(computed.borderBottomWidth, 10);

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.el.style.height = _height;

      const rows = Math.min(
        Math.max(
          (this.el.scrollHeight - offset) / lineHeight,
          this.computedMinRows
        ),
        this.computedMaxRows - 1
      );

      if (!this.localValue.trim()) {
        return `${minHeight}px`;
      }

      return `${Math.max(Math.ceil(rows * lineHeight + offset), minHeight)}px`;
    },
    computedAriaInvalid() {
      // eslint-disable-next-line
      if (!Boolean(this.ariaInvalid) || this.ariaInvalid === "false") {
        return this.computedState === false ? "true" : null;
      }

      if (this.ariaInvalid === true) {
        return "true";
      }

      return this.ariaInvalid;
    },
    computedState() {
      if (this.state === true || this.state === "valid") {
        return true;
      }

      if (this.state === false || this.state === "invalid") {
        return false;
      }

      return null;
    },
    stateClass() {
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
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.localValue = newVal;
      }
    },
    localValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("input", newVal);
      }
    }
  },
  methods: {
    handleInput(e) {
      this.localValue = e.target.value;
    }
  }
};
</script>
