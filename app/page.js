
"use client";
import React, { createRef, useEffect, useState } from 'react';
import './assets/font/iconfont.css'
import chineseColors from './assets/chinese-color.js'
import japanColors from './assets/japan-color.js'
const jinrishici = require('jinrishici');
import styles from './page.module.css'
let timer = ''

export default function () {
  const [colorsInfo, setColorsInfo] = useState(chineseColors)
  const [currentColor, setCurrentColor] = useState(chineseColors[0].hex)
  const [currentColorName, setCurrentColorName] = useState(chineseColors[0].name)
  const [currentIsDark, setCurrentIsDark] = useState(chineseColors[0].isDark)
  const [peomContentUp, setPeomContentUp] = useState('')
  const [peomContentDown, setpPeomContentDown] = useState('')
  const [peomAuthor, setPeomAuthor] = useState('')
  const [full, setFull] = useState(false)
  const [country, setCountry] = useState('china')
  const [status, setStatus] = useState('stop')
  const [currentJia, setCurrentJia] = useState('')

  const ref = createRef();


  const getPeomData = () => {

    jinrishici.load(res => {
      let contentArr = res.data.content.split('，')
      let author = res.data.origin.author
      setPeomContentUp(contentArr[0] + '，')
      setpPeomContentDown(contentArr[1])
      setPeomAuthor(author)
    })

    jinrishici.load(result => {
      console.log(result);
    });
  }


  useEffect(() => {



    getPeomData()
    const getPeomTimer = setInterval(() => {
      getPeomData()
    }, 1000 * 10)
    document.addEventListener('fullscreenchange', () => {
      if (!isFullScreenCurrently()) {
        setFull(false)
      }
    })
  }, [])


  const handleMouseOver = item => {

    setCurrentColor(item.hex)
    setCurrentColorName(item.name)
    setCurrentIsDark(item.isDark)


    if (item.jia) {
      setCurrentJia(item.jia)

    } else {
      setCurrentJia('')

    }
  }


  const changeNation = () => {


    let country2 = ''
    if (country === 'china') {
      country2 = 'japan'
    } else {
      country2 = 'china'
    }
    if (country2 === 'china') {

      setColorsInfo(chineseColors)
      setCountry(country2)
      setCurrentColor(chineseColors[0].hex)
      setCurrentColorName(chineseColors[0].name)
      setCurrentIsDark(chineseColors[0].isDark)
      setCurrentJia('')

    }

    if (country2 === 'japan') {
      setColorsInfo(japanColors)
      setCountry(country2)
      setCurrentColor(japanColors[0].hex)
      setCurrentColorName(japanColors[0].name)
      setCurrentIsDark(japanColors[0].isDark)
      setCurrentJia(japanColors[0].jia)

    }
    if (status === 'play') {
      stop()
    }
  }

  const isFullScreenCurrently = () => {
    var full_screen_element =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    // If no element is in full-screen
    if (full_screen_element === null) return false
    else return true
  }

  const fullScreen = () => {
    setFull(!full)
  }

  useEffect(() => {
    if (full) {
      const i = ref.current
      if (i.requestFullscreen) {
        i.requestFullscreen()
      } else if (i.webkitRequestFullscreen) {
        i.webkitRequestFullscreen()
      } else if (i.mozRequestFullScreen) {
        i.mozRequestFullScreen()
      } else if (i.msRequestFullscreen) {
        i.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }, [full])



  const play = () => {
    // 回到初始位置
    const scrollZone = document.getElementById('scroll')
    scrollZone.scrollTop = 0

    setStatus('play')
    let colorsInfo = colorsInfo,
      i = 1
    timer = setInterval(() => {
      setCurrentColor(colorsInfo[i].hex)
      setCurrentColorName(colorsInfo[i].name)
      setCurrentIsDark(colorsInfo[i].isDark)

      if (colorsInfo[i].currentJia) {
        setCurrentJia(colorsInfo[i].currentJia)
      }
      i++
      if (!colorsInfo[i]) i = 1
      // 大于 6 ，右边滚动到视野区域
      if (i > 6) {
        const scrollZone = document.getElementById('scroll')
        const setScrollHeight = (i - 6) * 60
        if (scrollZone) {
          scrollZone.scrollTop = setScrollHeight
        }
      }
    }, 5000)
  }
  const stop = () => {
    setStatus('stop')
    clearInterval(timer)
  }
  const control = () => {
    var audio = document.getElementById('music');
    if (audio !== null) {
      if (audio.paused) {
        audio.play();// 播放
      } else {
        audio.pause();// 暂停
      }
    }
  }


  return (
    <div
      className={styles.app}
      ref={ref}
      style={{
        width: '100vw',
        height: '100vh',
        color: '#fff', backgroundColor: currentColor
      }}
    >
      <div onClick={fullScreen} className="full-screen">
        {!full ? (
          <i
            className={'iconfont iconquanpingzuidahua iconfont-full-screen'}
          ></i>
        ) : (
          <i
            className={'iconfont icontuichuquanping2 iconfont-full-screen'}
          ></i>
        )}
      </div>
      <div className="button-span" onClick={changeNation}>
        <span className="button-text noselect">
          {country === 'china' ? '中' : '日'}
        </span>
      </div>
      {status === 'stop' ? (
        <i
          onClick={play}
          className={'iconfont iconxunhuanbofang play'}
        ></i>
      ) : (
        <i onClick={stop} className={'iconfont icontingzhi play'}></i>
      )}
      <span className='control' onClick={control}>播放/暂停</span>
      <audio
        src={country === 'japan' ? '/japan-bg.mp3' : '/china-bg.mp3'}
        autoPlay="autoplay"
        loop="loop"
        id='music'
      >
        Your browser does not support the audio element.
      </audio>
      <div
        className="current-name"
        style={{ color: `${currentIsDark ? '#000' : '#fff'}` }}
      >
        {currentJia ? (
          <p className="current-name-jia">{currentJia}</p>
        ) : (
          ''
        )}
        <p className="current-name-text noselect">{currentColorName}</p>
        <p className="current-name-color">{currentColor}</p>
      </div>
      <div
        className="poem"
        style={{ color: `${currentIsDark ? '#000' : '#fff'}` }}
      >
        <p className="poem-up">{peomContentUp}</p>
        <p className="poem-down">{peomContentDown}</p>
        <p className="poem-author">-- {peomAuthor}</p>
        {/* <p className="poem-up" id="poem_sentence_up">柳湖松岛莲花寺，</p> */}
        {/* <p className="poem-down" id="poem_sentence_down">晚动归桡出道场。</p> */}
      </div>

      <aside className="aside" id='scroll'>
        {colorsInfo.map((item, index) => (
          <div
            key={index}
            className="aside-piece"
            style={{ backgroundColor: `${item.hex}` }}
            onMouseOver={() => handleMouseOver(item)}
          >
            <div
              className="aside-piece-one"
              style={{ color: `${item.isDark ? '#000' : '#fff'}` }}
            >
              <p className="aside-piece-name"> {item.name} </p>
              <p className="aside-piece-color"> {item.hex}</p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  )

}
