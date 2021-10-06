import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, double, max_value, max } from 'vee-validate/dist/rules';

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

extend('required', {
    ...required,
    message: 'This field is required'
});

extend('double', {
    ...double,
    message: 'This field is double'
});

extend('max_value', {
    ...max_value,
    message: 'Insufficient funds'
});

extend('max', {
    ...max,
    message: 'Incorrect address'
});

extend('address', value => {
    let regexp = /0{1}x{1}.{40}/
    if (value.match(regexp)) {
        return true
    }
    return 'Incorrect address'
})

