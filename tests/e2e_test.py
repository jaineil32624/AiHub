# End-to-end test: python3 -m http.server 8802 & then  python3 tests/e2e_test.py
# The 401 console line is ignored because the test deliberately mocks a rejected API key.
import json
from playwright.sync_api import sync_playwright
import os, sys
PORT=os.environ.get("PORT","8802")
URL=f"http://localhost:{PORT}/index.html"
ok=0
def check(c,msg):
    global ok
    assert c, msg; ok+=1; print("PASS",msg)
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":1366,"height":900})
    pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append("PAGEERR "+str(e)))
    pg.on("console",lambda m: m.type=="error" and "401 (Unauthorized)" not in m.text and errs.append(m.text))
    pg.goto(URL); pg.wait_for_timeout(300)
    check(pg.locator(".card").count()==6,"6 module cards")
    check(pg.locator("#modeLbl").inner_text()=="Offline mode","offline mode chip")
    # assistant
    pg.fill("#inp","What is 18% of 245?"); pg.keyboard.press("Control+Enter")
    pg.wait_for_selector(".out .md"); check("44.1" in pg.inner_text(".out .md"),"assistant math")
    check(pg.locator(".badge.local").count()==1,"offline badge shown")
    pg.click("#copyBtn"); pg.wait_for_timeout(200); check(pg.locator(".toast").count()>=1,"copy toast")
    check(pg.locator("#histList li").count()>=1,"history recorded")
    # number keys -> summarizer
    pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("2"); pg.wait_for_timeout(200)
    check(pg.locator(".ptitle h3").inner_text()=="Content Summarizer","key 2 opens summarizer")
    pg.click("text=Sample: The Moon"); pg.wait_for_selector(".stats")
    check(pg.locator(".kw").count()>0,"summary keywords")
    pg.click("[data-len=bullets]"); pg.wait_for_timeout(900); check(pg.locator(".out .md li").count()>=3,"bullet summary")
    # planner
    pg.keyboard.press("Escape"); pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("3"); pg.wait_for_timeout(200)
    pg.fill("#inp","Run a 5K in 6 weeks"); pg.click("#runBtn"); pg.wait_for_selector(".step")
    n=pg.locator(".step").count(); check(n>=5,"planner steps")
    pg.locator(".step").nth(0).click(); pg.locator(".step").nth(1).click()
    check(pg.locator(".step.done").count()==2,"steps toggled")
    plans=pg.evaluate("JSON.parse(localStorage.getItem('aihub.plans'))"); check(any(len(v['done'])==2 for v in plans.values()),"plan progress saved")
    # eco
    pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("4"); pg.wait_for_timeout(200)
    pg.select_option("#ecoAct","flight"); pg.fill("#ecoAmt","500"); pg.click("#runBtn"); pg.wait_for_selector(".ecobig")
    check(pg.inner_text(".ecobig b")=="100","eco flight 500mi = 100 kg")
    pg.click("#logBtn"); check(pg.locator(".ecolog .bar").count()==1,"eco log entry")
    # creative
    pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("5"); pg.wait_for_timeout(200)
    pg.click("[data-ctype=haiku]"); pg.fill("#inp","the ocean"); pg.click("#runBtn"); pg.wait_for_selector(".out .md")
    check("haiku" in pg.inner_text(".out .md"),"creative haiku")
    before=pg.inner_text(".out .md"); pg.click("#remixBtn"); pg.wait_for_timeout(900); check(pg.locator(".out .md").count()==1,"remix works")
    # productivity + pomodoro
    pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("6"); pg.wait_for_timeout(200)
    pg.fill("#inp","I get distracted by my phone"); pg.click("#runBtn"); pg.wait_for_selector(".out .md")
    check(pg.locator(".out .md ol li").count()>=5,"productivity tips")
    pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("p"); pg.wait_for_timeout(1300)
    check(pg.inner_text("#pTime")!="25:00","pomodoro running")
    pg.click("#pReset"); check(pg.inner_text("#pTime")=="25:00","pomodoro reset")
    # palette
    pg.keyboard.press("Control+k"); pg.wait_for_selector("#palInp"); pg.keyboard.type("eco"); pg.keyboard.press("Enter"); pg.wait_for_timeout(300)
    check(pg.locator(".ptitle h3").inner_text().startswith("Environmental"),"palette navigates")
    # help, get app
    pg.click("body",position={"x":5,"y":5}); pg.keyboard.press("?"); check(pg.locator(".modal .keys").count()==1,"help overlay"); pg.keyboard.press("Escape")
    pg.click("#getAppBtn"); href=pg.get_attribute(".dl[href$='.apk']","href")
    check(href=="https://github.com/jaineil32624/AiHub/releases/latest/download/AiHub.apk","APK link"); pg.keyboard.press("Escape")
    # share link deep-link
    pg.goto(URL+"#planner?q="+ "Launch%20a%20small%20business"); pg.wait_for_selector(".step")
    check(pg.locator(".ptitle h3").inner_text()=="Smart Task Planner","deep link opens planner with query")
    # API key mode with mocked endpoint
    seen={}
    def handle(route):
        r=route.request; seen.update(r.headers); seen["body"]=r.post_data
        if seen.get("x-api-key")=="sk-ant-bad": route.fulfill(status=401,content_type="application/json",body=json.dumps({"error":{"message":"invalid x-api-key"}}),headers={"access-control-allow-origin":"*"})
        else: route.fulfill(status=200,content_type="application/json",body=json.dumps({"content":[{"type":"text","text":"**Hello** from mock Claude"}]}),headers={"access-control-allow-origin":"*"})
    pg.route("https://api.anthropic.com/v1/messages",handle)
    pg.goto(URL+"#assistant"); pg.click("#keyBtn"); pg.fill("#keyInp","sk-ant-test123"); pg.click("#keySave"); pg.wait_for_timeout(200)
    check(pg.inner_text("#modeLbl")=="Claude · own key","claude mode on after save")
    pg.fill("#inp","hi there"); pg.click("#runBtn"); pg.wait_for_selector(".badge.claude")
    check("mock Claude" in pg.inner_text(".out .md"),"claude response rendered")
    check(seen.get("anthropic-dangerous-direct-browser-access")=="true" and seen.get("x-api-key")=="sk-ant-test123" and seen.get("anthropic-version"),"correct headers sent")
    check(json.loads(seen["body"])["model"]=="claude-haiku-4-5","model claude-haiku-4-5")
    check("sk-ant" not in pg.url,"key never in URL")
    pg.evaluate("localStorage.setItem('aihub.apiKey',JSON.stringify('sk-ant-bad'))")
    pg.fill("#inp","What is 2+2"); pg.click("#runBtn"); pg.wait_for_selector(".note.err")
    check("401" in pg.inner_text(".note.err") and "4" in pg.inner_text(".out .md"),"graceful 401 with offline fallback")
    pg.click("#keyBtn"); pg.click("#keyDel"); pg.wait_for_timeout(200)
    check(pg.inner_text("#modeLbl")=="Offline mode" and pg.evaluate("localStorage.getItem('aihub.apiKey')") is None,"key removed")
    # mobile overflow
    m=b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,is_mobile=True,has_touch=True)
    mp=m.new_page(); mp.on("pageerror",lambda e:errs.append("PAGEERR "+str(e)))
    for mod in ["assistant","summarizer","planner","environmental","creative","productivity"]:
        mp.goto(URL+"#"+mod); mp.wait_for_timeout(250)
        if mod!="environmental": mp.click(".chip.ex >> nth=0"); mp.wait_for_timeout(900)
        else: mp.click("#runBtn"); mp.wait_for_timeout(600)
        sw=mp.evaluate("document.documentElement.scrollWidth"); check(sw<=390,f"no overflow at 390px on {mod} ({sw})")
    mp.click("#menuBtn"); check(mp.locator("#mobmenu.open").count()==1,"mobile menu opens")
    print("errors:",errs); check(not errs,"zero console/page errors")
    print("ALL PASSED",ok)
    b.close()
