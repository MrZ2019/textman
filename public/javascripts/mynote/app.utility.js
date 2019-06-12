/**
 * Created by sha on 8/24/14.
 */

var AppUtil =
{
};


function saveSettings(msg) {

    localStorage['$mynote'] = JSON.stringify(window.settings);  

    showSuccess(msg || '保存成功') 
}

function showSuccess(msg) {
	
    alertSuccess.fadeIn();
	alertSuccess.text(msg);
	alertSuccess.delay(1500).fadeOut();
}

function showError(msg) {
	alertError.fadeIn();
	alertError.text(msg);
	alertError.delay(1500).fadeOut();
}

function arrayShuffle(array, power) {

            // set default power
            power = power || 3;

            var arrayLength = array.length;

            var totalCount = arrayLength * power;

            // start loop

            var index1, index2;
            var item;

            for(var counter = 0; counter < totalCount; counter++) {

                // swap value use random index
                index1 = Math.round(Math.random() * (arrayLength - 1));
                index2 = Math.round(Math.random() * (arrayLength - 1));

                // save a item
                item = array[index1];

                array[index1] = array[index2];
                array[index2] = item;

                // finish a swap
            }

            // done, the array is shuffled

            return array;
        }


function random(maxInteger, minInteger) {

            maxInteger = maxInteger || 100;
            minInteger = minInteger || 0;

            var resultInteger;

            // use Math api, round() and random()

            resultInteger = Math.round(Math.random() * (maxInteger - minInteger) + minInteger);

            return resultInteger;
        }       