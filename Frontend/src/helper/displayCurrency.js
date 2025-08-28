const displayCurrency = (number)=>{
    const formater  = new Intl.NumberFormat('en-IN',{
        style : "currency",
        currency:'INR',
        maximumFractionDigits:2
    })

    return formater.format(number);
}
export default displayCurrency;