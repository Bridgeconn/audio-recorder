import { useState } from 'react';
import { IAudioData } from '../../../../types/editor';
import Delete from '../IconsComponents/Delete';
import Pause from '../IconsComponents/Pause';
import Play from '../IconsComponents/Play';
import Record from '../IconsComponents/Record';
import Rewind from '../IconsComponents/Rewind';
import Stop from '../IconsComponents/Stop';
import Waveform from './Waveform';

function AudioToolBar({ audioData }: { audioData: IAudioData | undefined }) {
	const [playPause, setPlayPause] = useState(false);
	const [control, setControl] = useState('');

	// const handlePlayAudio = () => {
	// 	setPlayPause((prev) => !prev);
	// };

	return (
		<div
			className='w-[99%] h-7 border border-gray-600 my-1 px-2 py-1 -bottom-10 right-0 self-center
        bg-[var(--vscode-textSeparator-foreground)] flex gap-5 items-center'>
			{/* Waves */}
			<div className='flex-1'>
				{audioData?.default && (
					<Waveform
						url={audioData[audioData['default']]}
						playPause={playPause}
						control={control}
					/>
				)}
			</div>

			{/* Buttons */}
			<div className='flex gap-2 items-center'>
				<button className='cursor-pointer flex justify-center items-center'>
					<Record classes='w-5 h-5 stroke-red-500 hover:stroke-red-700' />
				</button>

				<button className='cursor-pointer flex justify-center items-center'>
					<Stop classes='w-5 h-5  stroke-red-500 hover:stroke-red-700' />
				</button>

				{control === 'play' ? (
					<button
						className='cursor-pointer flex justify-center items-center'
						onClick={() => setControl('pause')}>
						<Pause classes='w-6 h-6 fill-blue-500 hover:fill-blue-600' />
					</button>
				) : (
					<button
						className='cursor-pointer flex justify-center items-center'
						onClick={() => setControl('play')}>
						<Play classes='w-5 h-5  stroke-green-500 hover:stroke-green-700' />
					</button>
				)}

				<button
					className='cursor-pointer flex justify-center items-center'
					onClick={() => setControl('rewind')}>
					<Rewind classes='w-5 h-5 stroke-red-500 hover:stroke-red-600' />
				</button>

				<button className='cursor-pointer flex justify-center items-center'>
					<Delete classes='w-5 h-5 stroke-red-500 hover:stroke-red-600' />
				</button>
			</div>
		</div>
	);
}

export default AudioToolBar;
