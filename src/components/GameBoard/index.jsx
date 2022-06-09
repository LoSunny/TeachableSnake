import React, { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './GameBoard.scss'

import SnakeCanvas from '../SnakeCanvas'
import loadVideo from '../../utilities/camera'
import staticStore from '../../context/staticStore'
import { isInFrame } from '../../utilities/snake'

function GameBoard () {
	const { actions } = useContext(StoreContext)

	const [userWebCam, setUserWebCam] = useState(null)
	const [model, setModel] = useState(null)

	async function loadModel() {
		// eslint-disable-next-line no-undef
		const loadedModel = await tmImage.load(staticStore.model.url + 'model.json', staticStore.model.url + 'metadata.json')
		setModel(loadedModel)
	}

	async function predictVideo(image) {
		if (model) {
			let prediction = await model.predict(image, 4)
			prediction = prediction.sort((a, b) => - (a.probability - b.probability))
			const predictType = prediction[0].className

			if (isInFrame) actions.updateSnakePosition({ predictType: predictType })

			predictVideo(userWebCam)
		}
	}

	// load the model (only once as component is mounted)
	useEffect(() => {
		loadModel()
	}, [])

	// load the video (only once as component is mounted)
	useEffect(() => {
		try {
			const video = loadVideo(document.getElementById('userWebCam'))
			video.then((resolvedVideo) => {
				setUserWebCam(resolvedVideo)
			})
		} catch (err) {
			throw err
		}
	}, [])

	// make prediction (as userWebCam and model is set)
	useEffect(() => {
		if (userWebCam) {
			predictVideo(userWebCam)
		}
	}, [userWebCam, model])

	return (
		<div id="GameBoard">
			<div className="info-bar">
				<h1 className="game-title">Teachable Snake</h1>
				<video id="userWebCam"></video>
			</div>
			<div className="main-canvas">
				<SnakeCanvas/>
			</div>
			<div className="btm-bar">
				<ul className="infos">
					<li className="info">Created by <a href="https://www.vinceshao.com/">Vince MingPu Shao</a></li>
					<li className="info">Powered by <a href="https://teachablemachine.withgoogle.com/">Google's Teachable Machine</a></li>
					<li className="info">Source code on <a href="https://github.com/vince19972/TeachableSnake">GitHub</a></li>
				</ul>
			</div>
		</div>
	)
}

export default GameBoard