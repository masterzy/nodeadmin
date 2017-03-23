/**
 * Created by master_zy on 2017/3/23.
 */
(function () {
    function add(a,b)
    {
        alert(a+b);
    }
    function sub(a,b)
    {
        alert(a-b);
    }
    add.call(sub,3,1);

})();