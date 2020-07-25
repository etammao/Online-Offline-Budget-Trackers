console.log( `connecting database...`)

const reqDB = indexedDB.open( "budget", 1 )

let db

reqDB.onsuccess = event => {
    db = event.target.result

    if( navigator.onLine ){
        checkDatabase()
    }
}

reqDB.onupgradeneeded = event => {
    //connect to the database
    let db = event.target.result
    //create object store(table/collection)
    const budgetStore = db.createObjectStore("pendingBudget", { autoIncrement: true })

}

function checkDatabase(){
    const transaction = db.transaction( ["pendingBudget"], "readwrite" )
    const transactionStore = transaction.objectStore( "pendingBudget" )
    const allTransactions = transactionStore.getAll()

    allTransactions.onsuccess = () => {
        if( allTransactions.result.length > 0 ){
            fetch("/api/transaction/bulk", {
                method:"POST",
                body: JSON.stringify( allTransactions.result ),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then( res => {
                return res.json()
            }).then( () => {
                const transaction = db.transaction( ["pendingBudget"], "readwrite" )
                const transactionStore = transaction.objectStore( "pendingBudget" )
                transactionStore.clear()
            })
        }
    }
}

function saveRecord( transactions ){
    const transaction = db.transaction( ["pendingBudget"], "readwrite" )
    const transactionStore = transaction.objectStore( "pendingBudget" )

    transactionStore.add( transactions )

}