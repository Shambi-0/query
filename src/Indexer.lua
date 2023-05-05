return {
    qRawGet = function(t, k)
        return t[k]
    end,
    qRawSet = function(t, k, v)
        t[k] = v;
    end
}