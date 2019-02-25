import '../../static/stylus/ModalA.styl'
import img from '../../assets/imgs/elephant.png'

console.log('this is page aaaa')


var app = new Vue({
    el: '#app',
    data: function() {
        return {
            message: 'Hello ModalAaaadd'
        }
    },
    created() {
        const a = [1,3,4]
        a.map((i,n) => {    
            console.log(i,n)
        })
    }
})
