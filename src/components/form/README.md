# Forms

The `<d-form>` component is a form wrapper that supports inline form styles and provides validation states.

## Inline Forms

You can create inline forms using the `inline` prop.

:::demo
```html
<d-form inline>
    <label class="sr-only" for="f1_Username">Username</label>
    <d-input id="f1_Username" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Username" />

    <label class="sr-only" for="f1_Password">Password</label>
    <d-input id="f2_Password" class="mr-2" type="password" placeholder="Password" />

    <d-button theme="primary">Register</d-button>
</d-form>

<!-- form-1.vue -->
```
:::

## Form Validation

The form component also provides validation states out of the box.

:::demo
```html
<template>
    <d-form @submit="handleOnSubmit" validated>

        <div class="form-group">
            <label class="sr-only" for="f2_Email">Email Address</label>
            <d-input id="f2_Email" class="mb-2 mr-sm-2 mb-sm-0" v-model="form.email" placeholder="email@example.com" required />
            <d-form-invalid-feedback>Invalid email address!</d-form-invalid-feedback>
            <d-form-valid-feedback>Your email looks good!</d-form-valid-feedback>
            <small class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
            <label for="f2_PasswordInput" class="sr-only">Password</label>
            <d-form-input id="f2_PasswordInput" type="password" v-model="form.password" required placeholder="Password"></d-form-input>
            <d-form-invalid-feedback>Please provide a valid password!</d-form-invalid-feedback>
        </div>

        <div class="form-group">
            <label for="f2_PasswordInput2" class="sr-only">Repeat Password</label>
            <d-form-input id="f2_PasswordInput2" type="password" v-model="form.password2" required placeholder="Repeat Password"></d-form-input>
        </div>

        <div class="form-group">
            <d-form-checkbox v-model="form.tos" value="tos_agree" unchecked-value="tos_do_not_agree">I agree with the <a href="#">Terms of Service</a></d-form-checkbox>
        </div>

        <d-button type="submit">Create Account</d-button>
    </d-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        email: 'myemail@example.com',
        password: '',
        password2: '',
        tos: 'tos_agree'
      }
    }
  },
  methods: {
    handleOnSubmit (e) {
      e.preventDefault();
      alert(JSON.stringify(this.form));
    }
  }
}
</script>

<!-- form-2.vue -->
```
:::
