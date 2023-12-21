document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('form');
    let inputs = form.querySelectorAll('input, textarea');
    let divs = form.querySelectorAll('.inp');
    let allFieldsFilled = true;


    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (!input.value.trim()) {
                divs[index].style.borderBottom = '2px solid red';
            } else {
                divs[index].style.borderBottom = '2px solid green';
            }

            // Check if all fields are filled after the input event
            checkAllFields();
        });

        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                divs[index].style.borderBottom = '2px solid red';
            }
        });
    });

    form.addEventListener('submit', (event) => {
        // Check if all fields are filled before form submission
        if (!allFieldsFilled) {
            event.preventDefault();
        }
    });

    function checkAllFields() {
        // Check if all fields are filled
        allFieldsFilled = Array.from(inputs).every((input) => input.value.trim() !== '');

        // Update the form submission status
        if (allFieldsFilled) {
            form.querySelector('button').removeAttribute('disabled');
        } else {
            form.querySelector('button').setAttribute('disabled', 'true');
        }
    }
});
