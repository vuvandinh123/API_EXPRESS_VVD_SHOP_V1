
// create function convert elxs to json
function convertElxsToJson(elxs) {
    let json = {}
    for (let elx of elxs) {
        json[elx.name] = elx.value
    }
    return json
}