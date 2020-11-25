function assertTrue(value, message){
    if (!value){
        throw message
    }
}

function assertFalse(value, message){
    if (value){
        throw message
    }
}

exports.assertTrue = assertTrue
exports.assertFalse = assertFalse