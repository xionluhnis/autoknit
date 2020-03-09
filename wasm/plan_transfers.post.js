/**
 * Wrapper code over WASM for plan_transfers
 */
class InvalidArgumentError extends Error {
    constructor(message){
        super();
        this.message = message;
    }
}
function needleFrom(str){
    let side;
    for(const s of ['fs', 'F', 'f', 'bs', 'B', 'b']){
        if(str.startsWith(s)){
            side = s;
            str = str.substring(s.length);
            break;
        }
    }
    if(!side || side.length === 0)
        throw new InvalidArgumentError('Invalid needle side: ' + str);
    else if(side.length === 2)
        side = side.charAt(0).toUpperCase();
    let offset = parseInt(str);
    return [side.charCodeAt(0), offset];
}

function knitoutNeedle(side, offset, asArray = false){
    const sstr = String.fromCharCode(side);
    switch(sstr){
        case 'f':
        case 'b':
            return asArray ? [sstr, offset] : sstr + offset;
        case 'F':
        case 'B':
            return asArray ? [sstr.toLowerCase() + 's', offset] : sstr.toLowerCase() + 's' + offset;
        default:
            return asArray ? [null, offset] : '?' + offset;
    }
}

Module['plan_transfers'] = function plan_transfers(from, to, slack = 2, maxRacking = 4, needlesAsArray = false){
    if(!from.length)
        return [];
    if(from.length !== to.length)
        throw new InvalidArgumentError('From and to arguments must be arrays of the same length');
    // create input
    xfer._allocate_input(from.length);
    for(let i = 0; i < from.length; ++i){
        const [f_bed, f_off] = needleFrom(from[i]);
        xfer._set_from_needle(i, f_bed, f_off);
        const [t_bed, t_off] = needleFrom(to[i]);
        xfer._set_to_needle(i, t_bed, t_off);
        // set slack if as an array
        if(Array.isArray(slack)){
            const s = slack[i];
            if(slack.length !== from.length)
                throw new InvalidArgumentError('Slack array must be the same size as from and to arrays');
            if(typeof s !== 'number')
                throw new InvalidArgumentError('Slack must either be an integer, or an array of integers');
            xfer._set_slack(i, s);
        }
    }
    if(!Array.isArray(slack)){
        if(typeof slack !== 'number')
            throw new InvalidArgumentError('Slack must either be an integer, or an array of integers');
        xfer._create_default_slack(slack);
    }

    // call wasm code
    const res = xfer._plan_cse_transfers(maxRacking);
    if(!res){
        return null;
    } else {
        const xfers = [];
        // get transfer list
        const xferCount = xfer._get_output_size();
        for(let i = 0; i < xferCount; ++i){
            // get from needle
            const f_bed = xfer._get_transfer_from_bed(i);
            const f_off = xfer._get_transfer_from_offset(i);
            const t_bed = xfer._get_transfer_to_bed(i);
            const t_off = xfer._get_transfer_to_offset(i);
            xfers.push([
                knitoutNeedle(f_bed, f_off, needlesAsArray),
                knitoutNeedle(t_bed, t_off, needlesAsArray)
            ]);
        }
        return xfers;
    }
};