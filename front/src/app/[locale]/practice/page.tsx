'use client';

import { useRef, useState } from "react"
import { useTranslations } from "next-intl";

export default function Stopwatch() {
  const t = useTranslations('practice');

  const [elapsedTime, setElapsedTime] = useState(0);        // 累計計測時間
  const [isRunning, setIsRunning] = useState(false);        // 計測中判定フラグ
  const intervalRef = useRef<NodeJS.Timeout | null>(null);  // タイマーIDの保管

  // 計測開始
  const handleStart = () => {

    // 初期化
    setIsRunning(true);
    setElapsedTime(0);
    if(intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 計測開始時刻をセット
    const now = Date.now();

    // タイマーID発行して、計測開始
    intervalRef.current = setInterval(() => {
      setElapsedTime((Date.now() - now) / 1000);
    }, 10);
  }

  // 一時停止
  const handlePause = () => {
    if(!isRunning) return;

    // タイマーIDを破棄して停止
    if(intervalRef.current){
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
  }

  // 再開
  const handleResume = () => {
    if(elapsedTime === 0) return;

    // 古いタイマーIDが残っている場合は破棄
    if(intervalRef.current){
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(true);

    // 累積計測時間をセット（※Stateの参照はラグにより正確に測れないため）
    const currentElapsedTime = elapsedTime;

    // 再開時刻をセット（※同上）
    const now = Date.now();

    // 新規タイマーIDを発行して計測再開
    intervalRef.current = setInterval(()=>{
      setElapsedTime(currentElapsedTime + (Date.now() - now) / 1000)
    } ,10);
  }

  // リセット
  const handleReset = () => {
    if(intervalRef.current){
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsedTime(0);
    setIsRunning(false);
  }

  return (
    <div className="m-8">
      <h1 className="text-3xl text-center font-semibold tabular-nums">{t('title')}：{elapsedTime.toFixed(3)}</h1>
      <div className="flex justify-center m-4 gap-8">

        {/* 開始 */}
        <button
          className="px-2 py-1 border-gray-600 border-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
          onClick={handleStart}
        >
          <span className="font-semibold">{t('start')}</span>
        </button>

        {/* 再開 */}
        <button
          className="px-2 py-1 border-gray-600 border-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
          onClick={handleResume}
        >
          <span className="font-semibold">{t('resume')}</span>
        </button>

        {/* ストップ */}
        <button
          className="px-2 py-1 border-gray-600 border-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
          onClick={handlePause}
        >
          <span className="justify-items-center font-semibold">{t('stop')}</span>
        </button>

        {/* リセット */}
        <button
          className="px-2 py-1 border-gray-600 border-3 rounded-md hover:cursor-pointer hover:bg-gray-200"
          onClick={handleReset}
        >
          <span className="justify-items-center font-semibold">{t('reset')}</span>
        </button>
      </div>
    </div>
  )
}
