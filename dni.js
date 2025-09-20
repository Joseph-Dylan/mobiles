 var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];

var resul = document.getElementById("resul")
var num = document.getElementById("num")
var let = document.getElementById("let")
var let_cal = document.getElementById("let-cal")

var numero = prompt("Introduce tu número de DNI sin la letra:")
numeroint = parseInt(numero)

while(numeroint < 0 || numeroint > 99999999){
    var numero = prompt("Error: Número inválido" + "\nIntroduce un número válido de DNI sin la letra:")
    numeroint = parseInt(numero)
}

var letraUsuario = prompt("Introduce la letra de tu DNI:")

var letracalculada = letras[numeroint % 23]

num.textContent = "Número de DNI: " + numero
    let.textContent = "Letra indicada por el usuario: " + letraUsuario
if(letraUsuario == letracalculada){
    let_cal.textContent = "Letra resultante: " + letracalculada
    
    resul.textContent = "El número y la letra de DNI son correctos."
}
else{
    let_cal.textContent = "Letra resultante: " + letracalculada
    
    resul.textContent = "La letra que ha indicado no es correcta."
}