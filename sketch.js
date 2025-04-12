let player;
let ground, ground2, ground3, ground4;
let gravity = 0.4;
let jumpForce = -10.25;
let isJumping;
let particles;
let gnomeLeft, gnomeRight, gnomeIdle, gnomeSound, gnomeSound2, gnomeSound3, backgroundMusic;
let blockImg0, blockImg1, blockImg2, blockImg3, blockImg4, blockImg5, blockImg6, blockImg7, blockImg8, blockImg9, blockImg10;
let groundWidth;
let groundX;
let level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12;
let darkness;
let lightRadius;
let level1Light;
let lever1, lever2, lever3, lever4, lever5, lever6, lever7, lever8, lever9;
var blockSize
let bubbleProtection, bubbleProtection2, bubbleProtectionImg, power1, power2, leverImgOn, leverImgOff;
let deathBarrier, deathBarrier2, deathBarrier3, deathBarrier4, deathBarrierBottom, deathBarrierBottom2, deathBarrierBottom3;
let portalImg1, portalImg2;
let blocks = [];
let levers = [];
let levels = [];
let activeLevers = [];
let alavanca3FoiAtivada = false;
let powerUp1 = false;
let powerUp2 = false;
let canPlay = true;
let canPlay2 = true;
let direction;
let difficulty = "";
var gameState = "level1";
//dicas iniciais
let hintAlpha = 255;
let hintAlpha1 = 255;
let hintAlpha2 = 255;
let hintAlpha3 = 255;
let leverMessageAlpha = 0;
let leverMessageVisible = false;
let leverMessageLines = [
    "INTERACT",
    "Press ENTER",
    "to toggle lever"
];
let leverFirstInteraction = false;
let leverMessageTargetAlpha = 0;
let leverMessageText = "Press ENTER\nto activate";
let bubbleMessageAlpha = 0;
let bubbleMessageTargetAlpha = 0;
const bubbleMessageLines = [
    "Requirements:",
    "Lever 1: OFF",
    "Lever 2: OFF", 
    "Lever 3: ON"
];
let bubble2MessageAlpha = 0;
let bubble2MessageTargetAlpha = 0;
//dash
let dashOrbIdleAnim;
let isDashing = false;
let dash = {
    lastPress: { key: '', time: 0 },
    lastDashTime: 0,  
    clickWindow: 200,  
    dashCooldown: 2000, 
    speed: 15, 
    duration: 150
};

const leverToLevelMap = [
    { lever: 1, activate: 2, deactivate: null }, 
    { lever: 2, activate: 3, deactivate: 1 },
    { lever: 3, activate: 4, deactivate: 2 },
    { lever: 4, activate: 6, deactivate: 4 }, 
    { lever: 5, activate: 7, deactivate: 5 }, 
    { lever: 6, activate: 8, deactivate: 6 },  
    { lever: 7, activate: 9, deactivate: 7 },  
    { lever: 8, activate: 10, deactivate: 8 },  
    { lever: 9, activate: 12, deactivate: 9 }
];

function preload(){
    blockSize = windowWidth/39.6;
    lightRadius = windowWidth/26.4;

    portalImg1 = loadImage("./Assets/Images/portal1.png");
    portalImg2 = loadImage("./Assets/Images/portal2.png");

    gnomeSound = loadSound("./Assets/Sounds/GnomeWoo-1.mp3");
    gnomeSound2 = loadSound("./Assets/Sounds/GnomeWoo-2.mp3");
    gnomeSound3 = loadSound("./Assets/Sounds/GnomeWee.mp3");
    gnomeSound.setVolume(0.2);
    gnomeSound2.setVolume(0.2);
    gnomeSound3.setVolume(0.5);

    backgroundMusic = loadSound("./Assets/Sounds/musicaprovisoria.mp3");

    dashOrbIdleAnim = loadAnimation(
        "./Assets/Images/dashOrb_00.png",
        "./Assets/Images/dashOrb_01.png",
        "./Assets/Images/dashOrb_02.png",
        "./Assets/Images/dashOrb_03.png",
        "./Assets/Images/dashOrb_04.png",
        "./Assets/Images/dashOrb_05.png",
        "./Assets/Images/dashOrb_06.png",
        "./Assets/Images/dashOrb_07.png",
        "./Assets/Images/dashOrb_08.png",
        "./Assets/Images/dashOrb_09.png",
        "./Assets/Images/dashOrb_10.png",
        "./Assets/Images/dashOrb_11.png",
        "./Assets/Images/dashOrb_12.png",
        "./Assets/Images/dashOrb_13.png",
        "./Assets/Images/dashOrb_14.png",
        "./Assets/Images/dashOrb_15.png"
    );

    gnomeIdle = loadAnimation(
        "./Assets/gnomo/gnomoIdle_0.png",
        "./Assets/gnomo/gnomoIdle_1.png",
        "./Assets/gnomo/gnomoIdle_2.png",
        "./Assets/gnomo/gnomoIdle_3.png"
    );

    gnomeLeft = loadAnimation(
        "./Assets/gnomo/gnomoLeft_0.png",
        "./Assets/gnomo/gnomoLeft_1.png",
        "./Assets/gnomo/gnomoLeft_2.png",
        "./Assets/gnomo/gnomoLeft_3.png"
    );

    gnomeRight = loadAnimation(
        "./Assets/gnomo/gnomoRight_0.png",
        "./Assets/gnomo/gnomoRight_1.png",
        "./Assets/gnomo/gnomoRight_2.png",
        "./Assets/gnomo/gnomoRight_3.png"
    );

    blockImg0 = loadImage("./Assets/Images/block_0.png");
    blockImg1 = loadImage("./Assets/Images/block_1.png");
    blockImg2 = loadImage("./Assets/Images/block_2.png");
    blockImg3 = loadImage("./Assets/Images/block_3.png");
    blockImg4 = loadImage("./Assets/Images/block_4.png");
    blockImg5 = loadImage("./Assets/Images/block_5.png");
    blockImg6 = loadImage("./Assets/Images/block_6.png");
    blockImg7 = loadImage("./Assets/Images/block_7.png");
    blockImg8 = loadImage("./Assets/Images/block_8.png");
    blockImg9 = loadImage("./Assets/Images/block_9.png");
    blockImg10 = loadImage("./Assets/Images/block_10.png");

    bubbleProtectionImg = loadImage("./Assets/Images/BubbleProtection.png");
    leverImgOn = loadImage("./Assets/Images/lever_1.png");
    leverImgOff = loadImage("./Assets/Images/lever_0.png");
}

function setup() {
    if(gameState == "level1"){
        let canvas = createCanvas(windowWidth, windowHeight);
        canvas.style('display', 'block');

        // Initialize these regardless of game state
        groundX = windowWidth/2;
        darkness = createGraphics(width, height);
        particles = new ParticleSystem();
        levelsAndLevers();

        // Create portals
        portal = createSprite(groundX * 2 - windowWidth/100, windowHeight * 1/8 -10, 20, 160);
        portal.addImage(portalImg1);
        portal.scale = 0.75;
        portal2 = createSprite(groundX/25 - windowWidth/100, windowHeight * 3/8 -10, 20, 160);
        portal2.addImage(portalImg2);
        portal2.scale = 0.75;
        portal3 = createSprite(groundX *2  - windowWidth/100, windowHeight * 3/8 -10, 20, 160);
        portal3.addImage(portalImg1);
        portal3.scale = 0.75;
        portal4 = createSprite(groundX/25  - windowWidth/100, windowHeight * 5/8 -10, 20, 160);
        portal4.addImage(portalImg2);
        portal4.scale = 0.75;
        portal5 = createSprite(groundX * 2 - windowWidth/100, windowHeight * 5/8 -10, 20, 160);
        portal5.addImage(portalImg1);
        portal5.scale = 0.75;
        portal6 = createSprite(groundX/25  - windowWidth/100, windowHeight * 7/8 -10, 20, 160);
        portal6.addImage(portalImg2);
        portal6.scale = 0.75;

        player = createSprite(windowWidth/19.8, windowWidth/-9, windowWidth/99, windowWidth/99);
        player.addAnimation("Idle", gnomeIdle);
        player.addAnimation("Left", gnomeLeft);
        player.addAnimation("Right", gnomeRight);
        player.setCollider("rectangle", 0, windowWidth/396, windowWidth/66, windowWidth/39.6);
        player.scale = windowWidth/(19800/7);

        deathBarrier = createSprite(windowWidth/2, windowHeight*1/4 - windowHeight/85, windowWidth, windowWidth/66);
        deathBarrier.visible = false;
        deathBarrierBottom = createSprite(windowWidth/2, windowHeight*1/4 - windowHeight/85 + blockSize/(windowWidth/198), windowWidth, windowWidth/66);
        deathBarrierBottom.visible = false;

        deathBarrier2 = createSprite(windowWidth/2, windowHeight/2 - windowHeight/85, windowWidth, windowWidth/66);
        deathBarrier2.visible = false;
        deathBarrierBottom2 = createSprite(windowWidth/2, windowHeight/2 - windowHeight/85 +blockSize/(windowWidth/198), windowWidth, windowWidth/66);
        deathBarrierBottom2.visible = false;

        deathBarrier3 = createSprite(windowWidth/2, windowHeight*3/4 - windowHeight/85, windowWidth, windowWidth/66);
        deathBarrier3.visible = false;
        deathBarrierBottom3 = createSprite(windowWidth/2, windowHeight*3/4 - windowHeight/85 + blockSize/(windowWidth/198), windowWidth, windowWidth/66);
        deathBarrierBottom3.visible = false;

        deathBarrier4 = createSprite(windowWidth/2, windowHeight - windowHeight/85, windowWidth, windowWidth/66);
        deathBarrier4.visible = false;

        power1 = createSprite(level4.width/3, level4.height * 1.55, windowWidth/39.6, windowWidth/39.6);
        power1.addAnimation("idleOrb", dashOrbIdleAnim);
        power1.scale = windowWidth/7920;
        power1.setCollider("circle", 0, 0, 100);

        power2 = createSprite(level4.width/3, level1.height * 1.88, windowWidth/39.6, windowWidth/39.6);
        power2.addAnimation("idleOrb", dashOrbIdleAnim);
        power2.scale = windowWidth/7920;
        power2.setCollider("circle", 0, 0, 100);

        bubbleProtection = createSprite(level4.width/3, level4.height * 1.41 + windowWidth/132, windowWidth/19.8,  windowWidth/19.8);
        bubbleProtection.addImage(bubbleProtectionImg, "blockImg");
        bubbleProtection.scale = windowWidth/2200;
        bubbleProtection.setCollider("rectangle", 0, 0, windowWidth/4.95, windowWidth/9.9);

        bubbleProtection2 = createSprite(level4.width/3, level1.height * 1.8 + windowWidth/132, windowWidth/19.8, windowWidth/19.8);
        bubbleProtection2.addImage(bubbleProtectionImg, "blockImg");
        bubbleProtection2.scale = windowWidth/2200;
        bubbleProtection2.setCollider("rectangle", 0, 0, windowWidth/4.95, windowWidth/9.9);

        createPlataform();
        
        frameRate(100);

        level1.visible = true;
        for (let i = 2; i <= 12; i++) {
            eval(`level${i}.visible = false`);
        }

        levels = [
            level1, level2, level3, level4, level5, level6,
            level7, level8, level9, level10, level11, level12
        ];
        
        // Previne zoom
        disableZoom();
    }
}  

function draw() {
    if(gameState == "level1"){
        if(!backgroundMusic.isPlaying()){
            canPlay2 = true;
        } else {
            canPlay2 = false;
        }

        if(canPlay2 == true){
            backgroundMusic.setVolume(0.5);
            backgroundMusic.play();
        }
        background(rgb(19, 129, 87));

        if(keyDown("d")){
            direction = 1;
        } else if(keyDown("a")){
            direction = -1;
        }
    
        player.animation.frameDelay = 12;
        
        //funcoes
        controls();
        teleporters();
        checkLevers();
        drawInstructions();
        updateLeverMessage();
        darknessFn();

        player.collide(bubbleProtection);
        player.collide(bubbleProtection2);
        player.collide(deathBarrierBottom);
        player.collide(deathBarrierBottom2);
        player.collide(deathBarrierBottom3);
    
        if (player.isTouching(deathBarrier) || player.isTouching(deathBarrier2) || player.isTouching(deathBarrier3)) {
            player.remove();
            
            rebuildBubbleProtection();

            player = createSprite(windowWidth/19.8, windowWidth/-99, windowWidth/99, windowWidth/99);
            player.addAnimation("Idle", gnomeIdle);
            player.addAnimation("Left", gnomeLeft);
            player.addAnimation("Right", gnomeRight);
            player.setCollider("rectangle", 0, windowWidth/396, windowWidth/66, windowWidth/39.6);
            player.scale = windowWidth/(19800/7);
            player.depth = 1;
            
            resetAllLevers();
            level1.visible = true;

            if (power1) power1.depth = 0;
            if (power2) power2.depth = 0;
        }

        if (bubbleProtection) bubbleProtection.depth = -1;
        if (bubbleProtection2) bubbleProtection2.depth = -1;
        if (power1) power1.depth = -2;
        if (power2) power2.depth = -2;
        player.depth = 100;

        if (bubbleProtection && bubbleProtection.visible) {
            const distance = dist(player.position.x, player.position.y, bubbleProtection.position.x, bubbleProtection.position.y);
            bubbleMessageTargetAlpha = (distance < 300) ? 255 : 0;
            
            if (bubbleMessageAlpha < bubbleMessageTargetAlpha) {
                bubbleMessageAlpha = min(bubbleMessageAlpha + 5, 255);
            } else if (bubbleMessageAlpha > bubbleMessageTargetAlpha) {
                bubbleMessageAlpha = max(bubbleMessageAlpha - 5, 0);
            }
        } else {
            bubbleMessageAlpha = 0;
        }
    
        if(player.collide(blocks)){
            isJumping = false;
        }
        
        for (let i = 0; i < blocks.length; i++) {
            if (player.collide(blocks[i])) {
                if (player.velocityY > 0 && player.position.y < blocks[i].position.y) {
                    player.position.y = blocks[i].position.y + windowWidth/-158.4;
                    player.velocityY = 0;
                }
            }
        }
    
        if(player.isTouching(power1)){
            powerUp1 = true;
            power1.remove();
        }else if(player.isTouching(power2)){
            powerUp2 = true;
            power2.remove();
        }

        //som
        canPlay = !gnomeSound.isPlaying() && !gnomeSound2.isPlaying();
    
        //particulas
        drawSprites();
        image(darkness, 0, 0);
        particles.update();
        particles.draw();
    
        if(levers[1].isActive){
            blocks[29].setCollider("point", 100, -10000);
            blocks[29].visible = false;
        } else {
            blocks[29].setCollider("rectangle", 0, 0, blockSize*2, blockSize*2);    
            blocks[29].visible = true;
        }
    }
}

function controls() {
    if (gameState === "level1") {
        if (keyWentDown('a')) handleKeyPress('a');
        if (keyWentDown('d')) handleKeyPress('d');

        // Movimento normal
        if (!isDashing) {
            if (keyDown('d')) {
                player.velocityX = 2.5;
                player.changeAnimation("Right");
            } else if (keyDown('a')) {
                player.velocityX = -2.5;
                player.changeAnimation("Left");
            } else {
                player.velocityX = 0;
                player.changeAnimation("Idle");
            }
            player.velocityY += gravity;
        }

        if ((keyDown("space") || keyDown(UP_ARROW)) && !isJumping && !isDashing && player.collide(blocks)) {
            player.velocityY = jumpForce;
            isJumping = true;

            if(canPlay){
                let i = Math.round(random(1,8))
                if(i > 1){
                    gnomeSound.play();
                } else {
                    gnomeSound2.play();
                }
            }
        }

        if(player.position.x > blocks[5].position.x){
            hintAlpha -= 8;
        }

        if(player.position.x > blocks[30].position.x){
            hintAlpha1 -= 8;
        }

        if(player.position.x > blocks[57].position.x && player.position.y > windowWidth/6){
            hintAlpha2 -= 8;
        }

        if(player.position.x > blocks[120].position.x && player.position.y > windowWidth/3){
            hintAlpha3 -= 8;
        }
    }
}

function handleKeyPress(key) {
    const now = millis();

    const canDash = (now - dash.lastDashTime) > dash.dashCooldown;

    if (key === dash.lastPress.key && (now - dash.lastPress.time) < dash.clickWindow && canDash && powerUp1 == true) {
        startDash(key === 'd' ? 1 : -1);
        dash.lastDashTime = now;
    }
    dash.lastPress = { key, time: now };
}

function startDash(direction) {
    isDashing = true;
    const isOnGround = player.collide(blocks);
    const dashSpeed = (isOnGround && powerUp2) ? dash.speed * 2 : dash.speed;
    
    player.velocityX = dashSpeed * direction;
    player.velocityY = 0;
    
    setTimeout(() => {
        isDashing = false;
        player.velocityX = 2.5 * direction;
    }, dash.duration);

    gnomeSound3.play();
}

function teleporters(){
    if(player.collide(portal)){
        player.position.x = portal2.position.x + player.width;
        player.position.y = portal2.position.y;
    }
    if(player.collide(portal2)){
        player.position.x = portal.position.x - player.width;
        player.position.y = portal.position.y;
    }
    if(player.collide(portal3)){
        player.position.x = portal4.position.x + player.width;
        player.position.y = portal4.position.y;
    }
    if(player.collide(portal4)){
        player.position.x = portal3.position.x - player.width;
        player.position.y = portal3.position.y;
    }
    if(player.collide(portal5)){
        player.position.x = portal6.position.x + player.width;
        player.position.y = portal6.position.y;
    }
    if(player.collide(portal6)){
        player.position.x = portal5.position.x - player.width;
        player.position.y = portal5.position.y;
    }
}

function createPlataform() {
    var platformWidth = windowWidth;
    groundWidth = windowWidth;
    groundX = windowWidth / 2;

    blocks = [];

    // Primeiro criamos todos os blocos sem imagens
    for (let x = 0; x < platformWidth; x += blockSize) {
        createSingleBlock(x + blockSize/2, windowHeight/4 - blockSize/2);
    }

    for (let y = 0; y < platformWidth; y += blockSize) {
        createSingleBlock(y + blockSize/2, windowHeight/2 - blockSize/2);
    }

    for (let z = 0; z < platformWidth; z += blockSize) {
        createSingleBlock(z + blockSize/2, windowHeight * 3/4 - blockSize/2);
    }

    for (let q = 0; q < platformWidth; q += blockSize) {
        createSingleBlock(q + blockSize/2, windowHeight - blockSize/2);
    }

    blocks[5].remove();
    blocks[6].remove();
    blocks[7].position.y -= blockSize;
    blocks[8].position.y -= blockSize;
    blocks[9].position.y -= blockSize;
    blocks[10].position.y -= blockSize;
    blocks[11].position.y -= blockSize;
    blocks[12].position.y -= blockSize;
    blocks[13].position.y -= blockSize;

    blocks[14].remove();
    blocks[15].remove();
    blocks[17].remove();
    blocks[18].remove();
    blocks[20].remove();
    blocks[21].remove();
    blocks[23].remove();
    blocks[24].remove();

    blocks[27].remove();
    blocks[28].remove();

    blocks[30].remove();
    blocks[31].remove();

    blocks[54].remove();
    blocks[54].remove();
    blocks[55].remove();
    blocks[55].remove();
    blocks[56].remove();
    blocks[56].remove();
    blocks[57].remove();
    createSingleBlock(900 + blockSize/2, windowHeight/2 - blockSize - blockSize/2);
    createSingleBlock(900 + blockSize/2, windowHeight/2 - blockSize*2 - blockSize/2);
    createSingleBlock(windowWidth/(396/175), windowHeight/2 - blockSize*2 - blockSize/2);
    blocks[60].remove();
    blocks[61].remove();
    blocks[62].remove();
    blocks[63].remove();

    blocks[67].remove();
    blocks[68].remove();
    blocks[69].remove();
    blocks[70].remove();
    blocks[71].remove();
    blocks[72].remove();
    blocks[73].position.x = windowWidth/1.2;
    createSingleBlock(windowWidth/1.2, windowHeight/2 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/1.2, windowHeight/2 - blockSize*2 - blockSize/2);
    blocks[74].remove();
    blocks[75].remove();

    blocks[84].remove();
    blocks[85].remove();
    blocks[86].remove();
    blocks[87].remove();
    blocks[88].remove();
    createSingleBlock(windowWidth/(396/35), windowHeight*3/4 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/(396/35), windowHeight*3/4 - blockSize*2 - blockSize/2);
    blocks[90].remove();
    blocks[91].remove();
    blocks[95].remove();
    blocks[96].remove();
    blocks[97].remove();
    createSingleBlock(windowWidth/(396/185), windowHeight*3/4 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/(396/185), windowHeight*3/4 - blockSize*2 - blockSize/2);
    blocks[99].remove();
    createSingleBlock(windowWidth/(396/205), windowHeight*3/4 - blockSize*2 - blockSize/2);
    createSingleBlock(windowWidth/(396/205), windowHeight*3/4 - blockSize*3 - blockSize/2);
    blocks[100].remove();
    blocks[101].remove();
    createSingleBlock(windowWidth/(44/25), windowHeight*3/4 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/(44/25), windowHeight*3/4 - blockSize*2 - blockSize/2);
    blocks[103].remove();
    blocks[104].remove();

    blocks[107].remove();
    createSingleBlock(windowWidth/(132/95), windowHeight*3/4 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/(132/95), windowHeight*3/4 - blockSize*2 - blockSize/2);
    createSingleBlock(windowWidth/(396/305), windowHeight*3/4 - blockSize*3 - blockSize/2);
    createSingleBlock(windowWidth/(396/305), windowHeight*3/4 - blockSize*2 - blockSize/2);
    createSingleBlock(windowWidth/(396/325), windowHeight*3/4 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/(396/325), windowHeight*3/4 - blockSize*2 - blockSize/2);
    createSingleBlock(windowWidth/(132/115), windowHeight*3/4 - blockSize*3 - blockSize/2);
    createSingleBlock(windowWidth/(132/115), windowHeight*3/4 - blockSize*2 - blockSize/2);
    createSingleBlock(windowWidth/(396/365), windowHeight*3/4 - blockSize - blockSize/2);
    createSingleBlock(windowWidth/(396/365), windowHeight*3/4 - blockSize*2 - blockSize/2);
    blocks[109].remove();
    blocks[110].remove();
    blocks[111].remove();
    blocks[113].remove();
    blocks[114].remove();
    blocks[115].remove();
    
    blocks[134].remove();
    blocks[135].remove();
    blocks[137].remove();
    blocks[138].remove();
    blocks[140].remove();
    blocks[141].remove();
    blocks[143].remove();
    blocks[144].remove();

    // Agora determinamos as imagens corretas para cada bloco
    determineBlockImages();
}

function determineBlockImages() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (!block.removed) {
            const x = block.position.x;
            const y = block.position.y;
            
            // Verifica vizinhos
            const hasLeft = blocks.some(b => 
                b !== block && !b.removed && 
                b.position.y === y && b.position.x === x - blockSize);
            
            const hasRight = blocks.some(b => 
                b !== block && !b.removed && 
                b.position.y === y && b.position.x === x + blockSize);

            const hasTop = blocks.some(b => 
                b !== block && !b.removed && 
                b.position.x === x && b.position.y === y - blockSize);
            
            const hasBottom = blocks.some(b => 
                b !== block && !b.removed && 
                b.position.x === x && b.position.y === y + blockSize);

            if (block.getAnimationLabel() === "blockImg") {
                block.removeAnimation("blockImg");
            }

            if (hasTop && hasBottom) {
                block.addImage(blockImg8, "blockImg");  // Cima e baixo
            }
            else if (hasBottom && !hasTop && !hasLeft && !hasRight) {
                block.addImage(blockImg9, "blockImg");  // Só baixo
            }
            else if (hasTop && !hasBottom && !hasLeft && !hasRight) {
                block.addImage(blockImg10, "blockImg"); // Só cima
            }
            else if (hasBottom) {
                if (hasRight && !hasLeft) {
                    block.addImage(blockImg6, "blockImg");  // Baixo e direita
                } else if (hasLeft && !hasRight) {
                    block.addImage(blockImg7, "blockImg");  // Baixo e esquerda
                } else {
                    block.addImage(blockImg3, "blockImg");  // Baixo e ambos lados
                }
            } 
            else if (hasTop) {
                if (hasRight && !hasLeft) {
                    block.addImage(blockImg4, "blockImg");  // Cima e direita
                } else if (hasLeft && !hasRight) {
                    block.addImage(blockImg5, "blockImg");  // Cima e esquerda
                } else {
                    block.addImage(blockImg3, "blockImg");  // Cima e ambos lados
                }
            }
            else {
                if (hasLeft && hasRight) {
                    block.addImage(blockImg3, "blockImg");  // Ambos lados
                } else if (!hasLeft && !hasRight) {
                    block.addImage(blockImg0, "blockImg");  // Isolado
                } else if (hasRight && !hasLeft) {
                    block.addImage(blockImg1, "blockImg");  // Só direita
                } else if (hasLeft && !hasRight) {
                    block.addImage(blockImg2, "blockImg");  // Só esquerda
                }
            }
        }
    }
}

function createSingleBlock(x, y) {
    let block = createSprite(x, y, blockSize, blockSize);
    block.scale = blockSize/(1000/11)
    block.debug = false;
    blocks.push(block);
}

function levelsAndLevers(){
    level1 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/198
    }
    level1 = createSprite(0, 0, level1.width*2, level1.height*2);
    level1.shapeColor = color(0, 0, 0, 0);

    level2 = {
        width: windowWidth/6,
        height: windowHeight/4 - windowWidth/198
    }
    level2 = createSprite(level2.width*3, 0, level2.width*2, level2.height*2);
    level2.shapeColor = color(0, 0, 0, 0);

    level3 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/198
    }
    level3 = createSprite(level3.width*3, 0, level3.width*2, level3.height*2);
    level3.shapeColor = color(0, 0, 0, 0);

    level4 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/49.5
    }
    level4 = createSprite(0, level4.height + level4.height*2.3/3, level4.width*2, level4.height + blockSize);
    level4.shapeColor = color(0, 0, 0, 0);

    level5 = {
        width: windowWidth/6,
        height: windowHeight/4 - windowWidth/49.5
    }
    level5 = createSprite(level5.width*3, level5.height + level5.height*2.3/3, level5.width*2, level5.height + blockSize);
    level5.shapeColor = color(0, 0, 0, 0);

    level6 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/49.5
    }
    level6 = createSprite(level6.width*3, level6.height + level6.height*2.3/3, level6.width*2, level6.height + blockSize);
    level6.shapeColor = color(0, 0, 0, 0);

    level7 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/49.5
    }
    level7 = createSprite(0, (level7.height + level7.height*2.135/3)*3/2+80, level7.width*2, level7.height + blockSize);
    level7.shapeColor = color(0, 0, 0, 0);

    level8 = {
        width: windowWidth/6,
        height: windowHeight/4 - windowWidth/49.5
    }
    level8 = createSprite(level8.width*3, (level8.height + level8.height*2.135/3)*3/2+80, level8.width*2, level8.height + blockSize);
    level8.shapeColor = color(0, 0, 0, 0);

    level9 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/49.5
    }
    level9 = createSprite(level9.width*3, (level9.height + level9.height*2.135/3)*3/2+80, level9.width*2, level9.height + blockSize);
    level9.shapeColor = color(0, 0, 0, 0);

    level10 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/49.5
    }
    level10 = createSprite(0, (level10.height + level10.height*2.115/3)*5/2-20, level10.width*2, level10.height + blockSize);
    level10.shapeColor = color(0, 0, 0, 0);

    level11 = {
        width: windowWidth/6,
        height: windowHeight/4 - windowWidth/49.5
    }
    level11 = createSprite(level11.width*3, (level11.height + level11.height*2.115/3)*5/2-20, level11.width*2, level11.height + blockSize);
    level11.shapeColor = color(0, 0, 0, 0);

    level12 = {
        width: windowWidth/3,
        height: windowHeight/4 - windowWidth/49.5
    }
    level12 = createSprite(level12.width*3, (level12.height + level12.height*2.115/3)*5/2-20, level12.width*2, level12.height + blockSize);
    level12.shapeColor = color(0, 0, 0, 0);

    
    levers = [
        new Lever(level1.width/2.2, level1.height/3 - blockSize, "lever1"),
        new Lever(level1.width/1.03, level1.height/3, "lever2"),
        new Lever(level1.width/0.69, level1.height/3, "lever3"),
        new Lever(level1.width/1.03, level4.height + level4.height*2/4, "lever4"),
        new Lever(level1.width/0.69, level4.height + level4.height*2/4, "lever5"),
        new Lever(level1.width/2.15, (level7.height + level7.height * 2/3) * 3/2, "lever6"),
        new Lever(level1.width/1.03, (level7.height + level7.height * 2/3) * 3/2, "lever7"),
        new Lever(level1.width/0.69, (level7.height + level7.height * 2/3) * 3/2, "lever8"),
        new Lever(level1.width/1.03, (level12.height + level12.height * 2/3) * 4/2, "lever9")
    ];

    levers.forEach(lever => {
        lever.shapeColor = color("gold");
    });

    activeLevers = Array(levers.length).fill(false);
}

function checkLevers() {
    for (let i = 0; i < levers.length; i++) {
        const lever = levers[i];
        const distance = dist(player.position.x, player.position.y, lever.sprite.position.x, lever.sprite.position.y);
        lever.canInteract = (distance <= windowWidth/26.4);

        // Controle visual da primeira alavanca (mensagem)
        if (i === 0) {
            if (!leverFirstInteraction) {
                leverMessageTargetAlpha = lever.canInteract ? 255 : 0;
            } else {
                leverMessageTargetAlpha = 0;
            }

            if (leverMessageAlpha < leverMessageTargetAlpha) {
                leverMessageAlpha = min(leverMessageAlpha + 5, 255);
            } else if (leverMessageAlpha > leverMessageTargetAlpha) {
                leverMessageAlpha = max(leverMessageAlpha - 5, 0);
            }

            for (let j = 134; j <= 144; j++) {
                if (levers[0].isActive) {
                    blocks[j].setCollider("rectangle", 0, 0, blockSize, blockSize);
                    blocks[j].visible = true;
                } else {
                    blocks[j].setCollider("point", 100, -10000);
                    blocks[j].visible = false;
                }
            }
        }

        // Lógica de interação para TODAS as alavancas
        if (lever.canInteract && keyWentDown(ENTER)) {
            // Atualiza estado visual
            lever.isActive = !lever.isActive;
            lever.sprite.addImage(lever.isActive ? leverImgOn : leverImgOff);

            // Marca primeira interação apenas para a primeira alavanca
            if (i === 0 && !leverFirstInteraction) {
                leverFirstInteraction = true;
                leverMessageAlpha = 0;
            }

            // Ativa/desativa níveis conforme mapeamento
            const mapping = leverToLevelMap[i];
            if (lever.isActive) {
                if (mapping.deactivate !== null && levels[mapping.deactivate - 1]) {
                    levels[mapping.deactivate - 1].visible = false;
                }
                if (levels[mapping.activate - 1]) {
                    levels[mapping.activate - 1].visible = true;
                }
            } else {
                if (levels[mapping.activate - 1]) {
                    levels[mapping.activate - 1].visible = false;
                }
            }

            // Lógica especial da alavanca 3
            if (i === 2 && lever.isActive) {
                alavanca3FoiAtivada = true;
            }
        }
    }

    // Lógica das bolhas de proteção
    if (alavanca3FoiAtivada && !levers[0].isActive && !levers[1].isActive && bubbleProtection) {
        bubbleProtection.remove();
    }
    
    const allActive = levers.slice(0, 8).every(l => l.isActive);
    if (allActive && bubbleProtection2) {
        bubbleProtection2.remove();
    }
}

function darknessFn() {
    darkness.clear();
    darkness.fill(0, 255);
    darkness.rect(0, 0, width, height);
    darkness.erase();

    darkness.ellipse(player.position.x, player.position.y, lightRadius);

    darkness.rect(
        level1.position.x - level1.width/2,
        level1.position.y - level1.height/2,
        level1.width,
        level1.height
    );

    if (powerUp1 === true && level5) {
        darkness.rect(
            level5.position.x - level5.width/2,
            level5.position.y - level5.height/2,
            level5.width,
            level5.height
        );
    }

    if (powerUp2 === true && level10) {
        darkness.rect(
            level10.position.x,
            level10.position.y - level10.height/2,
            level10.width,
            level10.height
        );
    }

    for (let i = 0; i < levers.length; i++) {
        const mapping = leverToLevelMap[i];
        if (levers[i].isActive && levels[mapping.activate - 1]) {
            const level = levels[mapping.activate - 1];
            darkness.rect(
                level.position.x - level.width/2,
                level.position.y - level.height/2,
                level.width,
                level.height
            );
        }
    }
    
    darkness.noErase();
}

function drawInstructions() {
    if (leverMessageAlpha > 0 && !leverFirstInteraction) {
        push();
        textSize(14); // Define o tamanho do texto primeiro
        
        // Texto que será exibido
        const lines = ["Press ENTER", "to activate"];
        const lineHeight = 18; // Altura entre linhas
        const padding = 10; // Espaçamento interno
        
        // Calcula a largura máxima do texto
        let maxWidth = 0;
        for (let line of lines) {
            let w = textWidth(line);
            if (w > maxWidth) maxWidth = w;
        }
        
        // Posição do balão (centralizado acima da alavanca)
        const xPos = levers[0].sprite.position.x;
        const yPos = levers[0].sprite.position.y - 50; // Ajuste este valor para subir/descer o balão
        
        // Desenha o fundo do balão
        fill(0, 0, 0, leverMessageAlpha * 0.7);
        stroke(255, 215, 0, leverMessageAlpha);
        strokeWeight(1);
        rectMode(CENTER);
        rect(xPos, yPos, maxWidth + padding * 2, (lines.length * lineHeight) + padding, 5);
        
        // Desenha o texto linha por linha
        noStroke();
        fill(255, 215, 0, leverMessageAlpha);
        textAlign(CENTER, CENTER);
        
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], xPos, yPos - (lines.length - 1) * lineHeight/2 + i * lineHeight);
        }
        
        pop();
    }

    if (hintAlpha > 0) {
        push();
        let xPos = blocks[3].position.x + blockSize * 2.5;
        let yPos = blocks[3].position.y - blockSize * 2.5;
        
        textSize(14);

        const lines = ["Press SPACE", "to jump"];
        const lineHeight = 18;
        const padding = 10;
        
        let maxWidth = 0;
        for (let line of lines) {
            let w = textWidth(line);
            if (w > maxWidth) maxWidth = w;
        }

        fill(0, 0, 0, hintAlpha * 0.7);
        stroke(255, 215, 0, hintAlpha);
        strokeWeight(1);
        rectMode(CENTER);
        rect(xPos, yPos, maxWidth + padding * 2, (lines.length * lineHeight) + padding, 5);

        noStroke();
        fill(255, 215, 0, hintAlpha);
        textAlign(CENTER, CENTER);
        
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], xPos, yPos - (lines.length - 1) * lineHeight/2 + i * lineHeight);
        }
        
        textSize(14);
        
        pop();
    }

    if (hintAlpha1 > 0) {
        push();
        let xPos = blocks[28].position.x + blockSize * 2.5;
        let yPos = blocks[28].position.y - blockSize * 2.5;
        
        textSize(14);

        const lines = ["Sometimes levers can", "change the level"];
        const lineHeight = 18;
        const padding = 10;
        
        let maxWidth = 0;
        for (let line of lines) {
            let w = textWidth(line);
            if (w > maxWidth) maxWidth = w;
        }

        fill(0, 0, 0, hintAlpha1 * 0.7);
        stroke(255, 215, 0, hintAlpha1);
        strokeWeight(1);
        rectMode(CENTER);
        rect(xPos, yPos, maxWidth + padding * 2, (lines.length * lineHeight) + padding, 5);

        noStroke();
        fill(255, 215, 0, hintAlpha1);
        textAlign(CENTER, CENTER);
        
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], xPos, yPos - (lines.length - 1) * lineHeight/2 + i * lineHeight);
        }
        
        textSize(14);
        
        pop();
    }

    if(hintAlpha2 > 0){
        const lines = ["Tap A or D twice to dash", "(hold space to climb)"];
        const lineHeight = 18;
        const padding = 10;
        
        let maxWidth = 0;
        for (let line of lines) {
            let w = textWidth(line);
            if (w > maxWidth) maxWidth = w;
        }
        
        let xPos2 = blocks[52].position.x + blockSize * 2.5;
        let yPos2 = blocks[52].position.y - blockSize * 2.5;

        fill(0, 0, 0, hintAlpha2 * 0.7);
        stroke(255, 215, 0, hintAlpha2);
        strokeWeight(1);
        rectMode(CENTER);
        rect(xPos2, yPos2, maxWidth + padding * 2, (lines.length * lineHeight) + padding, 5);

        noStroke();
        fill(255, 215, 0, hintAlpha2);
        textAlign(CENTER, CENTER);
        
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], xPos2, yPos2 - (lines.length - 1) * lineHeight/2 + i * lineHeight);
        }
    }

    if(hintAlpha3 > 0){
        const lines = ["You probably forgot about the third screen's message...", "let me remind you: Sometimes levers can change levels", "good luck, dont die (you goin' to need it LOL)"];
        const lineHeight = 18;
        const padding = 10;
        
        let maxWidth = 0;
        for (let line of lines) {
            let w = textWidth(line);
            if (w > maxWidth) maxWidth = w;
        }
        
        let xPos2 = blocks[136].position.x + blockSize * 3;
        let yPos2 = blocks[136].position.y - blockSize * 2.5;

        fill(0, 0, 0, hintAlpha3 * 0.7);
        stroke(255, 215, 0, hintAlpha3);
        strokeWeight(1);
        rectMode(CENTER);
        rect(xPos2, yPos2, maxWidth + padding * 2, (lines.length * lineHeight) + padding, 5);

        noStroke();
        fill(255, 215, 0, hintAlpha3);
        textAlign(CENTER, CENTER);
        
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], xPos2, yPos2 - (lines.length - 1) * lineHeight/2 + i * lineHeight);
        }
    }

    if (bubbleMessageAlpha > 0 && bubbleProtection && bubbleProtection.visible) {
        push();
        textSize(12);
        
        const lineHeight = 16;
        const padding = 8;
        
        // Texto fixo dos requisitos + estado atual entre parênteses
        const dynamicLines = [
            "Requirements to remove bubble:",
            "Lever 1 must be OFF (now: " + (levers[0].isActive ? "ON" : "OFF") + ")",
            "Lever 2 must be OFF (now: " + (levers[1].isActive ? "ON" : "OFF") + ")",
            "Lever 3 must be ON (now: " + (levers[2].isActive ? "ON" : "OFF") + ")"
        ];
        
        // Calcula a largura máxima do texto
        let maxWidth = 0;
        for (let line of dynamicLines) {
            let w = textWidth(line);
            if (w > maxWidth) maxWidth = w;
        }
        
        // Posição do balão (acima da bolha de proteção)
        const xPos = bubbleProtection.position.x - 270;
        const yPos = bubbleProtection.position.y - 50; // Aumentei para caber mais texto
        
        // Desenha o fundo do balão (um pouco mais largo)
        fill(0, 0, 0, bubbleMessageAlpha * 0.7);
        stroke(100, 200, 255, bubbleMessageAlpha);
        strokeWeight(1);
        rectMode(CENTER);
        rect(xPos, yPos, maxWidth + padding * 2, (dynamicLines.length * lineHeight) + padding, 5);
        
        // Desenha o texto
        noStroke();
        fill(100, 200, 255, bubbleMessageAlpha);
        textAlign(CENTER, CENTER);
        
        for (let i = 0; i < dynamicLines.length; i++) {
            // Cor diferente para os requisitos vs estado atual
            if (i === 0) {
                fill(255, 255, 255, bubbleMessageAlpha); // Branco para o título
            } else {
                // Verde se condição satisfeita, vermelho se não
                const conditionMet = 
                    (i === 1 && !levers[0].isActive) || 
                    (i === 2 && !levers[1].isActive) || 
                    (i === 3 && levers[2].isActive);
                
                fill(conditionMet ? 100 : 255, conditionMet ? 255 : 100, 100, bubbleMessageAlpha);
            }
            
            text(dynamicLines[i], xPos, yPos - (dynamicLines.length - 1) * lineHeight/2 + i * lineHeight);
        }
        
        pop();
    }

    if (bubbleProtection2 && bubbleProtection2.visible) {
        const distance = dist(player.position.x, player.position.y, bubbleProtection2.position.x, bubbleProtection2.position.y);
        bubble2MessageTargetAlpha = (distance < 300) ? 255 : 0;  // Distância ajustada para 220
        
        if (bubble2MessageAlpha < bubble2MessageTargetAlpha) {
            bubble2MessageAlpha = min(bubble2MessageAlpha + 5, 255);
        } else if (bubble2MessageAlpha > bubble2MessageTargetAlpha) {
            bubble2MessageAlpha = max(bubble2MessageAlpha - 5, 0);
        }

        if (bubble2MessageAlpha > 0) {
            push();
            textSize(12);
            
            const lineHeight = 16;
            const padding = 8;
            
            // Conta alavancas ativas (1-8)
            const activeCount = levers.slice(0, 8).filter(l => l.isActive).length;
            const allActive = activeCount === 7;
            
            const messageLines = [
                "Requirements to remove this bubble:",
                "All levers (1-8) must be ON",
                `Progress: ${activeCount}/8 activated`,
                `Status: ${allActive ? "✓ (READY)" : "✗ (NOT READY)"}`
            ];
            
            // Calcula a largura máxima
            let maxWidth = 0;
            for (let line of messageLines) {
                const w = textWidth(line);
                if (w > maxWidth) maxWidth = w;
            }
            
            // Posição acima da bolha
            const xPos = bubbleProtection2.position.x - 270 ;
            const yPos = bubbleProtection2.position.y - 50;  // Ajustado para caber mais linhas
            
            // Fundo do balão
            fill(0, 0, 0, bubble2MessageAlpha * 0.7);
            stroke(180, 100, 220, bubble2MessageAlpha);  // Roxo mais suave
            strokeWeight(1);
            rectMode(CENTER);
            rect(xPos, yPos, maxWidth + padding * 2, (messageLines.length * lineHeight) + padding, 5);
            
            // Desenha o texto
            noStroke();
            textAlign(CENTER, CENTER);
            
            for (let i = 0; i < messageLines.length; i++) {
                // Aplica cores diferentes
                if (i === 0) {
                    fill(255, 255, 255, bubble2MessageAlpha);  // Título branco
                } else if (i === messageLines.length - 1) {
                    // Última linha (status) - verde/vermelho
                    fill(allActive ? 100 : 220, allActive ? 220 : 100, 100, bubble2MessageAlpha);
                } else {
                    fill(180, 180, 255, bubble2MessageAlpha);  // Azul claro
                }
                
                text(messageLines[i], xPos, yPos - (messageLines.length - 1) * lineHeight/2 + i * lineHeight);
            }
            
            pop();
        }
    }
}

function resetAllLevers() {
    for (let i = 0; i < levers.length; i++) {
        if (levers[i].isActive) {
            levers[i].toggle();

            const mapping = leverToLevelMap[i];
            if (mapping.activate !== null && levels[mapping.activate - 1]) {
                levels[mapping.activate - 1].visible = false;
            }
        }
    }
    
    // Reseta o estado da alavanca 3
    alavanca3FoiAtivada = false;
}

function updateLeverMessage() {
    if (levers[0].isActive) {
        leverMessageText = "Press ENTER to deactivate";
    } else {
        leverMessageText = "Press ENTER to activate";
    }
    
    leverMessagePos = {
        x: levers[0].sprite.position.x,
        y: levers[0].sprite.position.y - 50
    };
}

function rebuildBubbleProtection() {
    // Remove as bolhas existentes se ainda estiverem no jogo
    if (bubbleProtection) bubbleProtection.remove();
    if (bubbleProtection2) bubbleProtection2.remove();
    
    // Recria a primeira bolha de proteção (ajustada para camada inferior)
    bubbleProtection = createSprite(level4.width/3, level4.height * 1.41 + windowWidth/132, windowWidth/19.8, windowWidth/19.8);
    bubbleProtection.addImage(bubbleProtectionImg, "blockImg");
    bubbleProtection.scale = windowWidth/2200;
    bubbleProtection.setCollider("rectangle", 0, 0, windowWidth/4.95, windowWidth/9.9);
    bubbleProtection.depth = -1; // Coloca atrás dos outros elementos
    
    // Recria a segunda bolha de proteção (ajustada para camada inferior)
    bubbleProtection2 = createSprite(level4.width/3, level1.height * 1.8 + windowWidth/132, windowWidth/19.8, windowWidth/19.8);
    bubbleProtection2.addImage(bubbleProtectionImg, "blockImg");
    bubbleProtection2.scale = windowWidth/2200;
    bubbleProtection2.setCollider("rectangle", 0, 0, windowWidth/4.95, windowWidth/9.9);
    bubbleProtection2.depth = -1; // Coloca atrás dos outros elementos
    
    // Recria os power-ups se foram coletados
    if (powerUp1) {
        power1 = createSprite(level4.width/3, level4.height * 1.55, windowWidth/39.6, windowWidth/39.6);
        power1.addAnimation("idleOrb", dashOrbIdleAnim);
        power1.scale = windowWidth/7920;
        power1.setCollider("circle", 0, 0, 100);
        powerUp1 = false; // Reseta o status do power-up
    }
    
    if (powerUp2) {
        power2 = createSprite(level4.width/3, level1.height * 1.88, windowWidth/39.6, windowWidth/39.6);
        power2.addAnimation("idleOrb", dashOrbIdleAnim);
        power2.scale = windowWidth/7920;
        power2.setCollider("circle", 0, 0, 100);
        powerUp2 = false; // Reseta o status do power-up
    }
}

//==============
//usei ia nessa
//==============
function disableZoom() {
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
            e.preventDefault();
        }
    });

    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
}
