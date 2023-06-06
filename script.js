window.onload= function()
{    

   //les variables 
    let canvasWidth=900;
    let canvasHeight=600;
    let blockSize=30;
    let ctx;
    let delay =100;
   
    let snacky;
    let pomme;
    let widthInBlock=canvasWidth/blockSize;
    let heightInBlock=canvasHeight/blockSize;
    let score;
    let timeout;


    init();

    //fonction d'initialisation 
    function init()
    {

       let canvas = document.createElement('canvas');
        canvas.width=canvasWidth;
        canvas.height=canvasHeight;
        canvas.style.border="30px solid grey";
        canvas.style.margin="50px auto";
        canvas.style.display="block";
        canvas.style.backgroundColor="#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snacky=new snake([[6,4],[5,4],[4,4]],"right");
        pomme=new apple([10,10]);
        score=0;

        refreshCanvas();
    }
    
    //fonction de rafraichissement 
    
    function refreshCanvas()
    {
        
        snacky.advance();
        if(snacky.checkCollision())
        {
            gameOver();

        }
        else
        {
            if(snacky.isEatingApple(pomme))
            {   score++
                snacky.eatApple=true
                do{

                    pomme.setNewPosition();
                }
                while(pomme.isOnSnake(snacky))
            }
            
            
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snacky.draw();
            pomme.draw();
            timeout=setTimeout(refreshCanvas,delay);
            
        }
        
    }
    function gameOver()
    {
        ctx.save();
        ctx.font="bold 80px sans-serif";
        ctx.fillStyle="black";
        ctx.textAlign="center";
        ctx.textBaseline='middle';
        ctx.strokeStyle="while";
        ctx.lineWidth=5;
        let centreX=canvasWidth/2;
        let centreY=canvasHeight/2;
        ctx.strokeText('Game Over',centreX,centreY-180);
        ctx.fillText('Game Over',centreX,centreY-180);
        ctx.font="bold 30px sans-serif";
        ctx.fillText('appuyer sur espace pour continuer',centreX,centreY -120);
        ctx.strokeStyle('appuyer sur espace pour continuer',centreX,centreY -120);
        ctx.restore();
    }
    function restart()
    {
        snacky=new snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        pomme=new apple([10,10]);
        score=0;
        clearTimeout(timeout);   
        refreshCanvas();

    }

    function drawScore()
    {
        ctx.save();
        ctx.font="bold 200px sanx-serif";
        ctx.fillStyle="gray";
        ctx.texralign="center";
        ctx.textBaseline='middle';
        let centreX=canvasWidth/2;
        let centreY=canvasHeight/2;
        ctx.fillText(score.toString(),centreX,centreY );
        ctx.restore();
    }
    function drawBlock(ctx,position){
        let x =position[0]*blockSize;
        let y =position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize)
    }

    function snake(body,direction)
    {
        this.body=body;
        this.direction=direction;
        this.eatApple=false;
        this.draw=function()
        {
            ctx.save();
            ctx.fillStyle='red';
            for(var i= 0 ;i < this.body.length; i++){
                drawBlock(ctx,this.body[i]);
            };
            ctx.restore();

        };
        this.advance = function()
        {
        

            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalide Direction");

            }
            this.body.unshift(nextPosition);
            if(!this.eatApple)
            {

                this.body.pop();
            }
            else{
                this.eatApple=false;
            }

        };
        this.setDirection= function(newDirection)
        {
            let allowedDirection;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirection=["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirection=["left","right"];
                    break;
                default:
                    throw("invalide direction");


            }
            if(allowedDirection.indexOf(newDirection)>-1)
            {
                this.direction=newDirection;
            }

        };
        this.checkCollision =function()
        {
            let wallCollision=false;
            let snakeCllision=false;
            let head=this.body[0];
            let rest=this.body.slice(1);
            let snakeX=head[0];
            let snakeY=head[1];

            let minX=0;
           let minY=0;
           let maxX=widthInBlock -1;
           let maxY=heightInBlock -1;

           let isNotBetweenHorizontalWalls= snakeX < minX || snakeX > maxX;
           let isNotBetweenVerticalWalls= snakeY < minY || snakeY > maxY;

           if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
           {
                wallCollision=true;
           }
           for(let i=0 ;i< rest.length; i++)
           {
            if(snakeX===rest[i][0] && snakeY === rest[i][1])
            {
                snakeCllision=true;
            }
           }

           return wallCollision || snakeCllision;

            

        }; 

        this.isEatingApple=function(appleToEat)
        {
            let head=this.body[0];
            if(head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1])
            {
                return true;
            }
            else
            {
                return false;
            }

        };
     }

    function apple(position)
    {
        this.position=position;
        this.draw=function()
        {
            ctx.save();
            ctx.fillStyle= 'GREEN';
            ctx.beginPath();
            let radius =blockSize/2;
            let x=this.position[0]*blockSize+radius;
            let y=this.position[1]*blockSize+radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function()
        {
            let newX = Math.round(Math.random() *(widthInBlock-1));
            let newY = Math.round(Math.random() *(heightInBlock-1));

            this.position=[newX,newY];
        };

        this.isOnSnake = function(snakeToCheck)
        {
            let isOnSnake=false;

            for (let i=0; i< snakeToCheck.body.length; i++)
            {
                if(this.position[0]=== snakeToCheck.body[i][0]&& this.position[i]===snakeToCheck.body[i][1])
                {
                    isOnSnake=true;
                }
            }
            return isOnSnake;
        };
    
    }



    document.onkeydown = function handleKeyDown(e)
    {
        let key=e.keyCode;
        let newDirection;
    
        switch(key)
        {
            case 37 :
                newDirection ="left";
                break;
            
            case 38:
                newDirection ="up";
                break;
                
            case 39:
                newDirection ="right";
                break;
        
            case 40:
                newDirection ="down";
                break;
            case 32:
                restart();
                return;

            default:
                return;
            
            
        }
        snacky.setDirection(newDirection);
    }
} 

