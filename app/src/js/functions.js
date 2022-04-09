let transactions = null
let transactionsFields = []

const tbodyTable = document.getElementById('reportsTable')
const trresultTable = document.getElementById('resultTable')
const tdTotalValue = document.getElementById('totalValue')
const textTotalValue = document.getElementById('totalValueText')

export function menuOpen() {
    document.getElementById('menu').style.display = 'block'
    
}

export function handleOpenMenu() {
    document.getElementById('menu').style.display = 'none'    
}

export function isValidFields() {

    document.querySelector('.errorValue').style = 'display: none'
    document.getElementById('value').style.borderColor = '#979797'

    const name = document.getElementById('itemName').value
    const value = document.getElementById('value').value
    const selectTransaction = document.getElementById('selectTransaction').value


    if ( name == '') 
    {
        document.getElementById('itemName').style.borderColor = '#ff0000'
        document.querySelector('.errorName').style = 'display: flex'
        document.querySelector('.errorNameText').innerHTML = 'O campo é obrigatório'
        return;
    } else if(value == '') {
        document.getElementById('value').style.borderColor = '#ff0000'
        document.querySelector('.errorValue').style = 'display: flex'
        document.querySelector('.errorValueText').innerHTML = 'O campo é obrigatório'
        return;
    }

    document.querySelector('.name').querySelector('input').value = ''
    document.querySelector('.value').querySelector('input').value = ''

    let valueNumberFormatedNumber = value

    valueNumberFormatedNumber = String(valueNumberFormatedNumber.slice(2))
    
    valueNumberFormatedNumber = valueNumberFormatedNumber.replace(/[#.]/g, '')

    valueNumberFormatedNumber = valueNumberFormatedNumber.replace(',', '.')

    if(transactions) {
        updateData(name, valueNumberFormatedNumber, selectTransaction)
    } else {
        createData(name, valueNumberFormatedNumber, selectTransaction)
    }
}

export function selectName() {
    document.querySelector('.errorName').style = 'display: none'
    document.getElementById('itemName').style.borderColor = '#979797'
}

export function selectValue() {
    document.querySelector('.errorValue').style = 'display: none'
    document.getElementById('value').style.borderColor = '#979797'
}

export async function createData(name, value, type) {

    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
    {
        method: 'POST',
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                records: [
                    {
                        fields: {
                            Responsavel: '1881',
                            Json: JSON.stringify([
                                { 
                                    type,
                                    name,
                                    value
                                }
                            ])
                        }
                    }
                ]
            }
        )
    }
    )
    .then(response => {
        return response.json()
    })

    await getData();

    noResults(false)

}

export async function deleteData() {

    const confirmed = confirm('Deseja realmente excluir todas as transações?');

    if(confirmed) {

    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
    {
        method: 'PATCH',
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                records: [
                    {
                        id: transactions.id,
                        fields: {
                            Responsavel: '1881',
                            Json: ''
                        }
                    }
                ]
            }
        )
    }
    )
    .then(response => {
        return response.json()
    })

    transactionsFields = []

    getData();
    }
}

export async function updateData(name, value, type) {

    transactionsFields.push({type, name, value})

    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",
    {
        method: 'PATCH',
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                records: [
                    {
                        id: transactions.id,
                        fields: {
                            Responsavel: '1881',
                            Json: JSON.stringify(transactionsFields)
                        }
                    }
                ]
            }
        )
    }
    )
    .then(response => {
        return response.json()
    })

    getData();

    noResults(false)
}

export async function getData() {
    
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '1881')"),
 {
     headers: {
         Authorization: "Bearer key2CwkHb0CKumjuM"
     },     
 }
)
.then(response => {
 return response.json()
}).then(json => transactions =  json.records[0])

if(transactions.fields.Json){
    transactionsFields = JSON.parse(transactions.fields.Json)
    setData(transactionsFields)
} else {
    noResults(true)
}

}

export async function setData(allTransactions) {

    const trAux = trresultTable;

    tbodyTable.innerHTML = ''

    tbodyTable.append(trAux)

    let totalTransaction = 0

    await allTransactions.forEach((transaction, i) => {

        if(transaction.type === '-') {
            totalTransaction -= Number(transaction.value)
        } else if(transaction.type === '+') {
            totalTransaction += Number(transaction.value)
        }

        const elementTr = document.createElement('tr')

        const elementTdName = document.createElement('td')
        const elementTdValue = document.createElement('td')
        
        elementTr.append(elementTdName)
        elementTr.append(elementTdValue)

        if(i === 0){
            elementTr.style.borderBottomStyle='double'
        }
        elementTdName.innerHTML = transaction.type + "&nbsp;&nbsp;&nbsp;" + transaction.name
        elementTdValue.innerHTML = maskValidator(transaction.value)
        tbodyTable.prepend(elementTr)
    });
    if(totalTransaction < 0){
        textTotalValue.innerHTML = '[PREJUÍZO]'
    } else if(totalTransaction > 0) {
        textTotalValue.innerHTML = '[LUCRO]'
    }else {
        textTotalValue.innerHTML = ''
    }
    tdTotalValue.innerHTML = (totalTransaction.toLocaleString('pt-BR', {minimumFractionDigits: 2, style: 'currency', currency: 'BRL'}))
    tdTotalValue.append(textTotalValue)
}

function maskValidator(valorMoeda) {
    const onlyDigits = valorMoeda
      .split("")
      .filter(s => /\d/.test(s))
      .join("")
      .padStart(3, "0")
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
    return currency(digitsFloat)
  }
  
function currency(valor, locale = 'pt-BR', currency = 'BRL') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor)
}

function noResults(hideTable) {
    if(hideTable === true) {
        document.querySelector('.transactionsReport').querySelector('table').style.display = 'none'
        document.querySelector('.transactionsReport').querySelector('h2').style.display = 'flex'
    } else {
        document.querySelector('.transactionsReport').querySelector('table').style.display = 'table'
        document.querySelector('.transactionsReport').querySelector('h2').style.display = 'none'
    }
    
}