<template>
	<div class="min-h-screen flex justify-between p-4 border-l border-r border-gray-200">
		<div class="w-1/2 h-24 px-4 [&>*]:mt-4">
			<label for="file" class="cursor-pointer relative">
				<div class="w-full h-24 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
					<Icon class="text-4xl text-gray-500" name="mynaui:file" />
				</div>
				<input type="file" accept="image/*" id="file" @change="onFileChange" class="hidden" />
				<div class="w-full h-full absolute top-0 left-0" style="z-index: 1" @drop.prevent="onDrop" @dragover.prevent="dragOverHandler"></div>
			</label>
			<div class="grid w-full items-center gap-1.5">
				<Label for="row2" class="font-semibold">Row2</Label>
				<Input type="text" v-model="row2" id="row2" />
				<div class="flex [&>*]:mr-1">
					<color v-model="row2Color" />
					<Select v-model="row2Typeface">
						<SelectTrigger>
							<SelectValue placeholder="Select typeface" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="BrockScript" class="font-[BrockScript]"> BrockScript </SelectItem>
								<SelectItem value="Shintyan" class="font-[Shintyan]"> Shintyan </SelectItem>
								<SelectItem value="YouraScript" class="font-[YouraScript]"> YouraScript </SelectItem>
								<SelectItem value="StillNight" class="font-[StillNight]"> StillNight </SelectItem>
								<SelectItem value="SignaritaZhaiRhianne" class="font-[SignaritaZhaiRhianne]"> SignaritaZhaiRhianne </SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<NumberField v-model="row2Size">
						<NumberFieldContent>
							<NumberFieldDecrement />
							<NumberFieldInput />
							<NumberFieldIncrement />
						</NumberFieldContent>
					</NumberField>
				</div>
			</div>
			<div class="grid w-full items-center gap-1.5">
				<Label for="row4" class="font-semibold">Row4</Label>
				<Input type="text" v-model="row4" id="row4" />
			</div>
			<div class="grid w-full items-center gap-1.5">
				<Label for="row5" class="font-semibold">Row5</Label>
				<Input type="text" v-model="row5" id="row5" />
			</div>
			<Button @click="downloadCanvas" class="cursor-pointer">
				<Icon name="line-md:cloud-alt-download" />
				Download
			</Button>
		</div>
		<div class="w-1/2 canvas-container">
			<canvas ref="canvasRef" width="0" height="0" class="border-1 border-gray-400"></canvas>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from "@/components/ui/number-field";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const paddingLeft = ref<number>(0);
const paddingRight = ref<number>(0);
const paddingTop = ref<number>(0);
const paddingBottom = ref<number>(0);

let canvasWidth: number = 0;
let canvasHeight: number = 0;

const row2 = ref<string>("Alice Clodia");
const row2Typeface = ref<string>("StillNight");
const row2Color = ref<string>("rgba(246,194,192, 1)");
const row2Size = ref<number>(4);
const row4 = ref<string>("LUMIX G85");
const row5 = ref<string>("25mm f/1.7 1/50s ISO160");

const imgObj = ref<HTMLImageElement | null>(null);

const setCanvasSize = (w: number, h: number) => {
	canvasWidth = w + paddingLeft.value + paddingRight.value;
	canvasHeight = h + paddingTop.value + paddingBottom.value;
	if (canvasRef.value) {
		canvasRef.value.width = canvasWidth;
		canvasRef.value.height = canvasHeight;
	}
};

const drawCanvas = () => {
	if (!canvasRef.value || !imgObj.value) return;
	const ctx = canvasRef.value.getContext("2d");
	if (!ctx) return;

	// 获取图片尺寸
	const imgWidth = imgObj.value.width;
	const imgHeight = imgObj.value.height;

	// 设置基准比例
	const baseSize: number = Math.sqrt(imgWidth ** 2 + imgHeight ** 2);
	const fontSize: number = baseSize * 0.01;

	// 设置边距
	paddingLeft.value = baseSize * 0.01;
	paddingRight.value = baseSize * 0.01;
	paddingTop.value = baseSize * 0.16;
	paddingBottom.value = baseSize * 0.16;

	// 设置 canvas 尺寸
	setCanvasSize(imgWidth, imgHeight);

	// 图片位置
	const drawX: number = paddingLeft.value + (canvasWidth - paddingLeft.value - paddingRight.value - imgWidth) / 2;
	const drawY: number = paddingTop.value + (canvasHeight - paddingTop.value - paddingBottom.value - imgHeight) / 2;

	// 设置 canvas
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	// 添加图片阴影
	ctx.save();
	ctx.shadowColor = "rgba(0,0,0,0.25)";
	ctx.shadowBlur = 64;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 24;
	ctx.drawImage(imgObj.value, drawX, drawY, imgWidth, imgHeight);
	ctx.restore();
	ctx.save();
	ctx.globalCompositeOperation = "destination-over";
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.restore();

	// 头部底部文字位置
	const textX1: number = canvasWidth / 2;
	const textY1: number = paddingTop.value / 2;
	const textY2: number = canvasHeight - paddingBottom.value / 2 - (fontSize * 2) / 2;

	interface configType {
		text: string;
		font: string;
		size: number;
		color: string;
		letterSpacing?: number;
	}
	// 配置化文本参数
	const WATERMARK_CONFIG = {
		line1: {
			text: "IDEATED BY",
			font: "CrimsonText",
			size: fontSize,
			color: "rgba(0, 0, 0, 0.8)",
		},
		line2: {
			text: row2.value,
			font: row2Typeface.value,
			size: fontSize * row2Size.value,
			color: row2Color.value,
		},
		line3: {
			text: "PHOTOGRAPH",
			font: "CrimsonText",
			size: fontSize,
			color: "rgba(0, 0, 0, 0.8)",
			letterSpacing: 1.4,
		},
		line4: {
			text: row4.value,
			font: "CrimsonText",
			size: fontSize * 2,
			color: "rgba(0, 0, 0, 0.8)",
		},
		line5: {
			text: row5.value,
			font: "CrimsonText",
			size: fontSize * 1.2,
			color: "rgba(0, 0, 0, 0.8)",
		},
	};

	// 公共样式设置
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// 绘制函数
	function drawWatermarkLine(config: configType, x: number, y: number) {
		if (!ctx) return;
		ctx.save();
		ctx.font = `${config.size}px ${config.font}`;
		ctx.fillStyle = config.color;

		if (config.letterSpacing) {
			const spacing = config.size * config.letterSpacing;
			const totalWidth = (config.text.length - 1) * spacing;
			let startX = x - totalWidth / 2;

			for (const char of config.text) {
				ctx.fillText(char, startX, y);
				startX += spacing;
			}
		} else {
			ctx.fillText(config.text, x, y);
		}

		ctx.restore();
	}

	// 执行绘制
	drawWatermarkLine(WATERMARK_CONFIG.line1, textX1, textY1 - (fontSize * (row2Size.value / 1.4)));
	drawWatermarkLine(WATERMARK_CONFIG.line2, textX1, textY1);
	drawWatermarkLine(WATERMARK_CONFIG.line3, textX1, textY1 + (fontSize * (row2Size.value / 2)));
	drawWatermarkLine(WATERMARK_CONFIG.line4, textX1, textY2);
	drawWatermarkLine(WATERMARK_CONFIG.line5, textX1, textY2 + fontSize * 2);
};

const onFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files && target.files[0]) {
		const file = target.files[0];
		const img = new Image();
		img.onload = () => {
			imgObj.value = img;
			drawCanvas();
		};
		img.onerror = () => {
			console.error("图片加载失败");
		};
		img.src = URL.createObjectURL(file);
	}
};

const onDrop = (event: DragEvent) => {
	event.preventDefault();
	if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
		const file = event.dataTransfer.files[0];
		const img = new Image();
		img.onload = () => {
			imgObj.value = img;
			drawCanvas();
		};
		img.onerror = () => {
			console.error("图片加载失败");
		};
		img.src = URL.createObjectURL(file);
	}
};

const dragOverHandler = (event: Event) => {
	event.preventDefault();
};

const downloadCanvas = () => {
	if (!canvasRef.value) return;
	if (!imgObj.value) return;
	const url = imgObj.value.src;
	const name = url.substring(url.lastIndexOf("/") + 1);
	const link = document.createElement("a");
	link.href = canvasRef.value.toDataURL("image/png");
	link.download = `watermarked-${name}.png`;
	link.click();
};

watch([row2, row2Typeface, row2Color, row2Size, row4, row5], () => {
	if (imgObj.value) {
		drawCanvas();
	}
});

let fontObserverAdded = false;

onMounted(() => {
	if (!fontObserverAdded) {
		fontObserverAdded = true;
		document.fonts.addEventListener("loadingdone", () => {
			drawCanvas();
		});
	}
});
</script>

<style scoped>
.canvas-container {
	width: 100%;
}

.canvas-container canvas {
	width: 100%;
	height: auto;
	image-rendering: -moz-crisp-edges;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: crisp-edges;
	image-rendering: pixelated;
	-ms-interpolation-mode: nearest-neighbor;
}
</style>
