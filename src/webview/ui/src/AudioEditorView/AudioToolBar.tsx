import { useState } from 'react';
import { IAudioData } from '../../../../types/editor';
import Delete from '../IconsComponents/Delete';
import Pause from '../IconsComponents/Pause';
import Play from '../IconsComponents/Play';
import Rewind from '../IconsComponents/Rewind';
import Waveform from './Waveform';
import Recorder from './Recorder';
import { vscode } from '../provider/vscodewebprovider';
import { EditorToExtMSgType } from '../../../../types/editor';
interface IAudioToolBarProps {
	audioData: IAudioData | undefined;
	selectedVerse: number;
}

function AudioToolBar({ audioData, selectedVerse }: IAudioToolBarProps) {
	const [control, setControl] = useState('');
	const handleDelete = () => {
		console.log('clicked delete audio');
		vscode.postMessage({
			type: EditorToExtMSgType.deleteAudio,
			data: { verse: selectedVerse },
		});
	};
	return (
		<div
			className='w-[99%] h-7 border border-gray-600 my-1 px-2 py-1 -bottom-10 right-0 self-center
        bg-[var(--vscode-textSeparator-foreground)] flex gap-5 items-center'>
			{/* Waves */}
			<div className='flex-1'>
				{audioData?.default && (
					<Waveform
						url={audioData[audioData['default']]}
						control={control}
					/>
				)}
			</div>

			{/* Buttons */}
			<div className='flex gap-2 items-center'>
				<Recorder selectedVerse={selectedVerse} />

				{control === 'play' ? (
					<button
						className='cursor-pointer flex justify-center items-center'
						onClick={() => setControl('pause')}
						title='Pause'>
						<Pause classes='w-6 h-6 fill-blue-500 hover:fill-blue-600' />
					</button>
				) : (
					<button
						className='cursor-pointer flex justify-center items-center'
						onClick={() => setControl('play')}
						title='Play'>
						<Play classes='w-5 h-5  stroke-green-500 hover:stroke-green-700' />
					</button>
				)}

				<button
					className='cursor-pointer flex justify-center items-center'
					onClick={() => setControl('rewind')}
					title='Rewind'>
					<Rewind classes='w-5 h-5 stroke-red-500 hover:stroke-red-600' />
				</button>

				<button
					className='cursor-pointer flex justify-center items-center'
					onClick={() => handleDelete()}
					title='Delete'>
					<Delete classes='w-5 h-5 stroke-red-500 hover:stroke-red-600' />
				</button>
			</div>
		</div>
	);
}

export default AudioToolBar;
