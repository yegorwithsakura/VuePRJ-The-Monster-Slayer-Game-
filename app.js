function getRandomValue(min, max){
    return Math.floor(Math.random() * ( max - min )) + min;
}

function getHeal(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}


const app = Vue.createApp({
    data(){
        return{
            playerHealth:100,
            monsterHealth:100,
            currentRound:0,
            winner:null,
            logMessages: [],
        }
    },
    watch:{
        playerHealth(value){
            if(value<=0 && this.monsterHealth <=0){
                //A draw
                this.winner = 'draw';
            }else if (value <= 0){
                //player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value){
            if(value <=0 && this.playerHealth <=0){
                // a draw
                this.winner = 'draw';
            }else if(value <= 0){
                //monster lost
                this.winner = 'player';
            }
        },
    },
    computed:{
        monsterBarStyle(){
            if(this.monsterHealth < 0){
                return{width: '0%'};
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyle(){
            if(this.playerHealth < 0){
                return{width: '0%'};
            }
            return {width: this.playerHealth + '%'};
        },
        mayUseSpecialAttack(){
            return this.currentRound % 3 !== 0;
        }
    },
    methods: {
        startNewGame(){
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        attackMonster(){
            this.currentRound++;
            const attackValue = getRandomValue(5,15);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer(){
            const attackValue = getRandomValue(8, 18);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttack(){
            this.currentRound++;
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'special-attack', attackValue);
            this.attackPlayer();
        },
        healPlayer(){
            this.currentRound++;
            const healValue = getHeal(8,20);
            if(this.playerHealth + healValue > 100){
                this.playerHealth = 100;
            }else{
                this.playerHealth +=healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        healMonster(){
            const healValue = getHeal(8,20);
            if(this.monsterHealth + healValue > 100){
                this.monsterHealth = 100;
            }else{
                this.monsterHealth +=healValue;
            };
            this.addLogMessage('monster', 'heal', healValue);
            this.attackMonster();
        },
        surrender(){
            this.winner = 'monster';
            this.playerHealth = 0;
        },
        addLogMessage(who, what , value){
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            })
        },
    },
})

app.mount('#game')