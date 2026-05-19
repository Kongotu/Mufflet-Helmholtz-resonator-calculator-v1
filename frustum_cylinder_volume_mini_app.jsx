import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function FrustumCylinderVolumeApp() {
  const defaults = {
    innerDiameter: 9,
    outerDiameter: 44,
    leftFrustumLength: 15,
    cylinderLength: 100,
    rightFrustumLength: 15,
  };

  const [values, setValues] = useState(defaults);

  const setValue = (key, value) => {
    const parsed = Number(value);
    setValues((prev) => ({
      ...prev,
      [key]: Number.isFinite(parsed) ? parsed : 0,
    }));
  };

  const result = useMemo(() => {
    const dSmall = values.innerDiameter;
    const dLarge = values.outerDiameter;
    const rSmall = dSmall / 2;
    const rLarge = dLarge / 2;

    const frustumVolume = (h) => {
      return (Math.PI * h * (rLarge ** 2 + rSmall ** 2 + rLarge * rSmall)) / 3;
    };

    const cylinderVolume = Math.PI * rLarge ** 2 * values.cylinderLength;

    const left = frustumVolume(values.leftFrustumLength);
    const center = cylinderVolume;
    const right = frustumVolume(values.rightFrustumLength);
    const totalOuterShape = left + center + right;

    const totalLength =
      values.leftFrustumLength + values.cylinderLength + values.rightFrustumLength;
    const innerPipeVolume = Math.PI * rSmall ** 2 * totalLength;
    const netVolume = totalOuterShape - innerPipeVolume;

    return {
      rSmall,
      rLarge,
      left,
      center,
      right,
      totalOuterShape,
      totalLength,
      innerPipeVolume,
      netVolume,
    };
  }, [values]);

  const format = (num, digits = 2) => {
    if (!Number.isFinite(num)) return "-";
    return num.toLocaleString(undefined, {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
  };

  const ResultRow = ({ label, value, unit = "mm³" }) => (
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">
        {format(value)} {unit}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            원뿔대 + 원통 + 원뿔대 부피 계산기
          </h1>
          <p className="text-gray-600">
            양쪽 테이퍼 구간과 가운데 원통 구간의 체적을 계산합니다. 중심에 관이 지나가는 경우를 고려해 내부 관 체적을 뺀 순수 공간 체적도 함께 계산합니다.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">입력값</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setValues(defaults)}
                  className="gap-2 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4" />
                  초기화
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>작은 지름 d, 중심 관 외경 기준 (mm)</Label>
                  <Input
                    type="number"
                    value={values.innerDiameter}
                    onChange={(e) => setValue("innerDiameter", e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>큰 지름 D, 챔버 외경 기준 (mm)</Label>
                  <Input
                    type="number"
                    value={values.outerDiameter}
                    onChange={(e) => setValue("outerDiameter", e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>좌측 원뿔대 길이 (mm)</Label>
                    <Input
                      type="number"
                      value={values.leftFrustumLength}
                      onChange={(e) => setValue("leftFrustumLength", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>가운데 원통 길이 (mm)</Label>
                    <Input
                      type="number"
                      value={values.cylinderLength}
                      onChange={(e) => setValue("cylinderLength", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>우측 원뿔대 길이 (mm)</Label>
                    <Input
                      type="number"
                      value={values.rightFrustumLength}
                      onChange={(e) => setValue("rightFrustumLength", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700">
                <div className="font-semibold text-gray-900">계산 기준</div>
                <p className="mt-2 leading-6">
                  외형 체적 = 좌측 원뿔대 + 가운데 원통 + 우측 원뿔대<br />
                  순수 공간 체적 = 외형 체적 - 중심 관 체적
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">단면 개념도</h2>
                <div className="rounded-2xl bg-white p-4">
                  <svg viewBox="0 0 720 230" className="h-auto w-full">
                    <defs>
                      <linearGradient id="body" x1="0" x2="1">
                        <stop offset="0%" stopColor="#e5e7eb" />
                        <stop offset="50%" stopColor="#f9fafb" />
                        <stop offset="100%" stopColor="#e5e7eb" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M80 115 L180 55 L540 55 L640 115 L540 175 L180 175 Z"
                      fill="url(#body)"
                      stroke="#111827"
                      strokeWidth="3"
                    />
                    <rect x="60" y="97" width="600" height="36" rx="18" fill="#d1d5db" stroke="#111827" strokeWidth="2" />
                    <line x1="180" y1="45" x2="180" y2="185" stroke="#9ca3af" strokeDasharray="8 8" />
                    <line x1="540" y1="45" x2="540" y2="185" stroke="#9ca3af" strokeDasharray="8 8" />
                    <text x="120" y="35" textAnchor="middle" fontSize="18" fontWeight="700">원뿔대</text>
                    <text x="360" y="35" textAnchor="middle" fontSize="18" fontWeight="700">원통</text>
                    <text x="590" y="35" textAnchor="middle" fontSize="18" fontWeight="700">원뿔대</text>
                    <text x="360" y="214" textAnchor="middle" fontSize="16" fill="#4b5563">중심 관 체적은 최종 순수 공간 체적에서 제외</text>
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">계산 결과</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <h3 className="mb-2 font-semibold">구간별 외형 체적</h3>
                    <ResultRow label="좌측 원뿔대" value={result.left} />
                    <ResultRow label="가운데 원통" value={result.center} />
                    <ResultRow label="우측 원뿔대" value={result.right} />
                    <ResultRow label="외형 체적 합계" value={result.totalOuterShape} />
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5">
                    <h3 className="mb-2 font-semibold">최종 체적</h3>
                    <ResultRow label="전체 길이" value={result.totalLength} unit="mm" />
                    <ResultRow label="중심 관 체적" value={result.innerPipeVolume} />
                    <ResultRow label="순수 공간 체적" value={result.netVolume} />
                    <ResultRow label="순수 공간 체적" value={result.netVolume / 1000} unit="cm³" />
                    <ResultRow label="순수 공간 체적" value={result.netVolume / 1000000} unit="L" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-900 p-5 text-white">
                  <div className="text-sm text-gray-300">현재 조건의 순수 공간 체적</div>
                  <div className="mt-1 text-3xl font-bold">
                    {format(result.netVolume / 1000)} cm³
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
