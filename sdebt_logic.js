function providerArray(old,fromTo){
    // change simplified to normal simplified
    if(old === 0){
        return new Array(fromTo[1].length).fill(new Array(fromTo[1].length).fill(0));
    }
    let createSimplified = new Array(fromTo[1].length).fill(new Array(fromTo[1].length).fill(0));
    for(let i=0;i<old.length;i++){
        const giver = old[i][0];
        const getter = old[i][1];
        const amount = old[i][2];
        createSimplified[giver][getter] = amount;
    }
    return createSimplified;
}
function iterate(fromTo,showAmount,simplified,amount){
    // make simplified & showAmount from given fromTo
    const from = fromTo[0];
    for(let i=0;i<fromTo[1].length;i++){
        if(i!==from && fromTo[1][i] > 0){
            showAmount[i] = [showAmount[i][0],showAmount[i][1]+fromTo[1][i]];
            simplified[i][from] = fromTo[1][i];
        }if(i===from){
            showAmount[i] = [showAmount[i][0]+(amount-fromTo[1][i]),showAmount[i][1]];
        }
    }
    return [showAmount,simplified];
}
function fromOldToNewSimplified(old,simplified){
    // add old and new simplified
    for(let i=0;i<old.length;i++){
        for(let j=0;j<old[i].length;j++){
            if(old[i][j]>0){
                simplified[i][j]+=old[i][j];
            }
        }
    }
    return simplified;
}
const sdebt = (arr)=>{
    
    let res=[]
    
    const mincompare=(x,y)=>{
        return x > y ? y : x;
    }
    const total=(arr)=>{
        let newarr= Array(arr.length).fill(0);
        for(let i=0;i<arr.length;i++){
            for(let j=0;j<arr.length;j++){
                newarr[i] += (arr[j][i] - arr[i][j])
            }
        }
        return newarr;
    }
    const max=(arr)=>{
        let max=0;
        for(let i in arr){
            if(arr[max]<arr[i]) max = i
        }
        return max;
    }
    const min=(arr)=>{
        let min=0;
        for(let i in arr){
            if(arr[min]>arr[i]) min = i
        }
        return min;
    }
    const minConnection=(arr,res)=>{
        minIndex = min(arr);
        maxIndex = max(arr);
        if(arr[maxIndex]===0 && arr[minIndex]===0) return;
        let minValue = mincompare(-arr[minIndex],arr[maxIndex]);
        arr[minIndex] += minValue;
        arr[maxIndex] -= minValue;
        res.push([parseInt(minIndex),parseInt(maxIndex),minValue])
        return minConnection(arr,res);
    }

    minConnection(total(arr),res);

    // for(let i in res){
    //     console.log(`${member[res[i][0]]} gives ${member[res[i][1]]} ${res[i][2]} rupees`);
    // }
    return res;
}
// const res = sdebt(arr,member);

const makeSimplified=(fromTo,showAmount,simplified,amount)=>{
    let oldSimplified = providerArray(simplified,fromTo);
    let [newShowAmount,newSimplified] = iterate(fromTo,showAmount,oldSimplified,amount);
    let simplifiedVersion = sdebt(newSimplified);
    return [newShowAmount,simplifiedVersion.length>0?simplifiedVersion : 0]; 
}

module.exports = makeSimplified;
// const member = ["p1","p2","p3","p4"]
//     const arr = [[0,0,0,0],[0,0,0,20],[10,10,0,0],[20,0,10,0]]
// console.log(sdebt(arr,member));
