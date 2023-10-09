

def block_count(file_path, block_size=65536):
    count = 0
    with open(file_path, 'r', encoding='utf-8') as f:
        block = f.read(block_size)
        while len(block) > 0:
            count += block.count('\n')
            block = f.read(block_size)
    return count

htmlLineNum = 0;

htmlLineNum += block_count('../bounty.html')
htmlLineNum += block_count('../deck.html')
htmlLineNum += block_count('../decklist.html')
htmlLineNum += block_count('../playerevent.html')
htmlLineNum += block_count('../gamepanel.html')
htmlLineNum += block_count('../globalevent.html')
htmlLineNum += block_count('../home.html')
htmlLineNum += block_count('../map.html')
htmlLineNum += block_count('../options.html')
htmlLineNum += block_count('../shop.html')

print('htmlLine = ' + str(htmlLineNum))

jsLineNum = 0;

jsLineNum += block_count('./api.js')
jsLineNum += block_count('./bounty.js')
jsLineNum += block_count('./deck.js')
jsLineNum += block_count('./decklist.js')
jsLineNum += block_count('./playerevent.js')
jsLineNum += block_count('./gamepanel.js')
jsLineNum += block_count('./globalevent.js')
jsLineNum += block_count('./home.js')
jsLineNum += block_count('./lottery.js')
jsLineNum += block_count('./map.js')
jsLineNum += block_count('./options.js')
jsLineNum += block_count('./shop.js')

print('jsLine = ' + str(jsLineNum))

scssLineNum = 0;

scssLineNum += block_count('../scss/_app.scss')
scssLineNum += block_count('../scss/bounty.scss')
scssLineNum += block_count('../scss/deck.scss')
scssLineNum += block_count('../scss/decklist.scss')
scssLineNum += block_count('../scss/playerevent.scss')
scssLineNum += block_count('../scss/gamepanel.scss')
scssLineNum += block_count('../scss/globalevent.scss')
scssLineNum += block_count('../scss/home.scss')
scssLineNum += block_count('../scss/index.scss')
scssLineNum += block_count('../scss/map.scss')
scssLineNum += block_count('../scss/options.scss')
scssLineNum += block_count('../scss/shop.scss')


print('scssLine = ' + str(scssLineNum))

print("sum = " + str((htmlLineNum + jsLineNum + scssLineNum)))

print(block_count('GameConfig.json'));
