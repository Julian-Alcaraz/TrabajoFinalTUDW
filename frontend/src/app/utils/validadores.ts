import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function ValidarEmail(control: AbstractControl) {
  const email = control?.value as string;
  const EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (email != null && email.length > 0 && !EMAIL_REGEXP.test(email)) {
    return { ValidarEmail: 'Email no válido.' };
  } else {
    return null;
  }
}

export function ValidarCadenaSinEspacios(control: AbstractControl) {
  if (control.value && control.value.trim() === '') {
    return { ValidarCadenaSinEspacios: true };
  } else {
    return null;
  }
}

// Validador personalizado para verificar que dos campos sean iguales
export const ContraseniasIguales: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { contraseñasNoCoinciden: true } : null;
};

export function ContraseniaIgualDni(dni: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control && control.value === dni.toString()) {
      return { contraseniaIgualDni: true };
    }
    return null;
  };
}
export function ValidarDni(control: AbstractControl) {
  const dni = control?.value;
  if (String(dni).length != 8) {
    return { ValidarDni: 'El dni tiene que ser de 8 numeros.' };
  } else {
    return null;
  }
}

// Validador personalizado para verificar que el campo solo contenga números
export function ValidarSoloNumeros(control: AbstractControl) {
  const NUMERIC_REGEXP = /^\d+$/;

  if (!NUMERIC_REGEXP.test(control.value)) {
    return { ValidarSoloNumeros: { message: 'Este campo solo debe contener números.' } };
  } else {
    return null;
  }
}

// No se usa actualmente:
export function ValidarSinNumeros(control: AbstractControl): ValidationErrors | null {
  const SIN_NUMEROS_REGEXP = /^[^\d]*$/; // Coincide con cualquier cadena que no contenga dígitos

  if (control.value && !SIN_NUMEROS_REGEXP.test(control.value)) {
    return { ValidarSinNumeros: 'Este campo no debe contener números.' };
  } else {
    return null;
  }
}

export function ValidarSoloLetras(control: AbstractControl): ValidationErrors | null {
  const SOLO_LETRAS_REGEXP = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Solo permite letras (con tildes y ñ) y espacios
  if (control.value && !SOLO_LETRAS_REGEXP.test(control.value)) {
    return { ValidarSoloLetras: 'Este campo solo debe contener letras y espacios.' };
  } else {
    return null;
  }
}

export function ValidarCampoOpcional(...validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // Campo vacío considerado válido
      return null;
    }
    const composedValidator = Validators.compose(validators);
    return composedValidator ? composedValidator(control) : null;
  };
}

export function ValidarNumerosFloat(control: AbstractControl): ValidationErrors | null {
  const POSITIVE_FLOAT_REGEXP = /^(?!0)[0-9]+(\.[0-9]+)?$/;
  if (control.value !== null && control.value !== '' && !POSITIVE_FLOAT_REGEXP.test(control.value)) {
    return { ValidarNumerosFloat: 'Este campo solo debe contener números positivos válidos.' };
  }
  return null;
}

export function ValidarHora(control: AbstractControl): ValidationErrors | null {
  const HORA_REGEXP = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (control.value && !HORA_REGEXP.test(control.value)) {
    return { ValidarHora: true };
  }
  return null;
}
